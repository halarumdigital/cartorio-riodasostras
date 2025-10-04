import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "./auth";
import bcrypt from "bcryptjs";
import { insertUserSchema, type User, insertSiteSettingsSchema, insertContactsSchema, insertServiceSchema, type Service, insertBannerSchema, type Banner, insertGallerySchema, type GalleryItem, insertPageSchema, type Page, insertContactMessageSchema, type ContactMessage, insertGoogleSettingsSchema, insertScriptsSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"));
    }
  },
});

// Upload for documents (PDF and images)
const uploadDocuments = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/');
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Apenas PDFs e imagens são permitidos"));
    }
  },
});

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      password: string;
      fullName: string;
      email: string;
      isAdmin: boolean;
      createdAt: Date;
    }
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores." });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: User, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login falhou" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        const { password, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const { password, ...userWithoutPassword } = req.user!;
    res.json({ user: userWithoutPassword });
  });

  // User management routes (admin only)
  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const usersWithoutPassword = allUsers.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Nome de usuário já existe" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email já está em uso" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  });

  app.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await storage.updateUser(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (req.user!.id === id) {
        return res.status(400).json({ message: "Você não pode deletar sua própria conta" });
      }

      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  });

  // Site settings routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({ settings: settings || {} });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  });

  app.post("/api/upload/logo", requireAdmin, upload.single("logo"), async (req, res) => {
    try {
      console.log("Upload request received");
      console.log("File:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
      }

      const filePath = `/uploads/${req.file.filename}`;
      console.log("File saved to:", filePath);
      res.json({ filePath });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message || "Erro ao fazer upload" });
    }
  });

  app.put("/api/site-settings", requireAdmin, async (req, res) => {
    try {
      const settingsData = insertSiteSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateSiteSettings(settingsData);
      res.json({ settings: updatedSettings });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      console.error("Erro ao atualizar configurações:", error);
      res.status(500).json({ message: "Erro ao atualizar configurações" });
    }
  });

  // Contacts routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contactsData = await storage.getContacts();
      res.json({ contacts: contactsData || {} });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar contatos" });
    }
  });

  app.put("/api/contacts", requireAdmin, async (req, res) => {
    try {
      const contactsData = insertContactsSchema.parse(req.body);
      const updatedContacts = await storage.updateContacts(contactsData);
      res.json({ contacts: updatedContacts });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      console.error("Erro ao atualizar contatos:", error);
      res.status(500).json({ message: "Erro ao atualizar contatos" });
    }
  });

  // Google Settings routes
  app.get("/api/google-settings", async (req, res) => {
    try {
      const googleSettings = await storage.getGoogleSettings();
      res.json({ googleSettings: googleSettings || {} });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar configurações do Google" });
    }
  });

  app.put("/api/google-settings", requireAdmin, async (req, res) => {
    try {
      const googleSettingsData = insertGoogleSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateGoogleSettings(googleSettingsData);
      res.json({ googleSettings: updatedSettings });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      console.error("Erro ao atualizar configurações do Google:", error);
      res.status(500).json({ message: "Erro ao atualizar configurações do Google" });
    }
  });

  // Scripts routes
  app.get("/api/scripts", async (req, res) => {
    try {
      const scriptsData = await storage.getScripts();
      res.json({ scripts: scriptsData || {} });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar scripts" });
    }
  });

  app.put("/api/scripts", requireAdmin, async (req, res) => {
    try {
      const scriptsData = insertScriptsSchema.parse(req.body);
      const updatedScripts = await storage.updateScripts(scriptsData);
      res.json({ scripts: updatedScripts });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      console.error("Erro ao atualizar scripts:", error);
      res.status(500).json({ message: "Erro ao atualizar scripts" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json({ services });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar serviços" });
    }
  });

  app.post("/api/services", requireAdmin, async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const newService = await storage.createService(serviceData);
      res.status(201).json({ service: newService });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar serviço" });
    }
  });

  app.put("/api/services/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = insertServiceSchema.parse(req.body);
      const updatedService = await storage.updateService(id, serviceData);

      if (!updatedService) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      res.json({ service: updatedService });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao atualizar serviço" });
    }
  });

  app.delete("/api/services/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteService(id);

      if (!deleted) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      res.json({ message: "Serviço deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar serviço" });
    }
  });

  // Banners routes
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getAllBanners();
      res.json({ banners });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar banners" });
    }
  });

  app.post("/api/upload/banner", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhuma imagem enviada" });
      }

      const filePath = `/uploads/${req.file.filename}`;
      res.json({ filePath });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message || "Erro ao fazer upload" });
    }
  });

  app.post("/api/banners", requireAdmin, async (req, res) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const newBanner = await storage.createBanner(bannerData);
      res.status(201).json({ banner: newBanner });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar banner" });
    }
  });

  app.put("/api/banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bannerData = insertBannerSchema.parse(req.body);
      const updatedBanner = await storage.updateBanner(id, bannerData);

      if (!updatedBanner) {
        return res.status(404).json({ message: "Banner não encontrado" });
      }

      res.json({ banner: updatedBanner });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao atualizar banner" });
    }
  });

  app.patch("/api/banners/:id/toggle", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { active } = req.body;

      const updatedBanner = await storage.updateBanner(id, { active });

      if (!updatedBanner) {
        return res.status(404).json({ message: "Banner não encontrado" });
      }

      res.json({ banner: updatedBanner });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar status do banner" });
    }
  });

  app.delete("/api/banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBanner(id);

      if (!deleted) {
        return res.status(404).json({ message: "Banner não encontrado" });
      }

      res.json({ message: "Banner deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar banner" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const gallery = await storage.getAllGalleryItems();
      res.json({ gallery });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar galeria" });
    }
  });

  app.post("/api/upload/gallery", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhuma imagem enviada" });
      }

      const filePath = `/uploads/${req.file.filename}`;
      res.json({ filePath });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message || "Erro ao fazer upload" });
    }
  });

  app.post("/api/gallery", requireAdmin, async (req, res) => {
    try {
      const galleryData = insertGallerySchema.parse(req.body);
      const newItem = await storage.createGalleryItem(galleryData);
      res.status(201).json({ item: newItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar item da galeria" });
    }
  });

  app.put("/api/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const galleryData = insertGallerySchema.parse(req.body);
      const updatedItem = await storage.updateGalleryItem(id, galleryData);

      if (!updatedItem) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      res.json({ item: updatedItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao atualizar item da galeria" });
    }
  });

  app.patch("/api/gallery/:id/toggle", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { active } = req.body;

      const updatedItem = await storage.updateGalleryItem(id, { active });

      if (!updatedItem) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      res.json({ item: updatedItem });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar status do item" });
    }
  });

  app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGalleryItem(id);

      if (!deleted) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      res.json({ message: "Item da galeria deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar item da galeria" });
    }
  });

  // Solicitações routes
  app.post("/api/solicitacoes", uploadDocuments.fields([
    { name: 'documentosVendedores', maxCount: 1 },
    { name: 'documentosPessoasFisicasVendedores', maxCount: 1 },
    { name: 'documentosCompradores', maxCount: 1 },
    { name: 'documentosPessoasFisicasCompradores', maxCount: 1 },
    { name: 'documentosImoveis', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const dadosFormulario: any = { ...req.body };

      // Adicionar caminhos dos arquivos ao dados do formulário
      if (files) {
        Object.keys(files).forEach(fieldName => {
          if (files[fieldName] && files[fieldName][0]) {
            dadosFormulario[fieldName] = `/uploads/${files[fieldName][0].filename}`;
          }
        });
      }

      // Determinar tipo e nome da solicitação baseado na URL
      const tipoSolicitacao = "solicite-sua-escritura";
      const nomeSolicitacao = "Solicite sua Escritura";

      await storage.createSolicitacao({
        tipoSolicitacao,
        nomeSolicitacao,
        dadosFormulario: JSON.stringify(dadosFormulario)
      });

      res.json({ message: "Solicitação enviada com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      res.status(500).json({ message: "Erro ao enviar solicitação" });
    }
  });

  // Pages routes
  app.get("/api/pages", async (req, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json({ pages });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar páginas" });
    }
  });

  app.get("/api/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Página não encontrada" });
      }
      res.json({ page });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar página" });
    }
  });

  app.post("/api/pages", requireAdmin, async (req, res) => {
    try {
      console.log('Recebendo dados para criar página:', req.body);
      const pageData = insertPageSchema.parse(req.body);
      console.log('Dados validados:', pageData);
      const newPage = await storage.createPage(pageData);
      console.log('Página criada:', newPage);
      res.status(201).json({ page: newPage });
    } catch (error) {
      console.error('Erro ao criar página:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar página" });
    }
  });

  app.put("/api/pages/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pageData = insertPageSchema.parse(req.body);
      const updatedPage = await storage.updatePage(id, pageData);

      if (!updatedPage) {
        return res.status(404).json({ message: "Página não encontrada" });
      }

      res.json({ page: updatedPage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao atualizar página" });
    }
  });

  app.patch("/api/pages/:id/toggle", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { active } = req.body;

      const updatedPage = await storage.updatePage(id, { active });

      if (!updatedPage) {
        return res.status(404).json({ message: "Página não encontrada" });
      }

      res.json({ page: updatedPage });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar status da página" });
    }
  });

  app.delete("/api/pages/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePage(id);

      if (!deleted) {
        return res.status(404).json({ message: "Página não encontrada" });
      }

      res.json({ message: "Página deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar página" });
    }
  });

  // Contact Messages routes
  app.get("/api/contact-messages", requireAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar mensagens de contato" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      console.log('📨 Recebendo mensagem de contato:', req.body);
      const messageData = insertContactMessageSchema.parse(req.body);
      console.log('✅ Dados validados:', messageData);
      const newMessage = await storage.createContactMessage(messageData);
      console.log('💾 Mensagem salva no banco:', newMessage);
      res.status(201).json({ message: newMessage });
    } catch (error) {
      console.error('❌ Erro ao criar mensagem de contato:', error);
      if (error instanceof z.ZodError) {
        console.error('Erros de validação:', error.errors);
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar mensagem de contato" });
    }
  });

  app.patch("/api/contact-messages/:id/toggle-read", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { lido } = req.body;

      const updatedMessage = await storage.updateContactMessage(id, { lido });

      if (!updatedMessage) {
        return res.status(404).json({ message: "Mensagem não encontrada" });
      }

      res.json({ message: updatedMessage });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar status da mensagem" });
    }
  });

  app.delete("/api/contact-messages/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContactMessage(id);

      if (!deleted) {
        return res.status(404).json({ message: "Mensagem não encontrada" });
      }

      res.json({ message: "Mensagem deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar mensagem" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
