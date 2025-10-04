import { type User, type InsertUser, users, type SiteSettings, type InsertSiteSettings, siteSettings, type Contacts, type InsertContacts, contacts, type Service, type InsertService, services, type Banner, type InsertBanner, banners, type GalleryItem, type InsertGalleryItem, gallery, type Solicitacao, type InsertSolicitacao, solicitacoes, type Page, type InsertPage, pages, type ContactMessage, type InsertContactMessage, contactMessages, type GoogleSettings, type InsertGoogleSettings, googleSettings, type Scripts, type InsertScripts, scripts } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
  getContacts(): Promise<Contacts | undefined>;
  updateContacts(contactsData: Partial<InsertContacts>): Promise<Contacts>;
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  getAllBanners(): Promise<Banner[]>;
  getBanner(id: number): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;
  getAllGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItem(id: number): Promise<GalleryItem | undefined>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined>;
  createSolicitacao(solicitacao: InsertSolicitacao): Promise<Solicitacao>;
  deleteGalleryItem(id: number): Promise<boolean>;
  getAllPages(): Promise<Page[]>;
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<boolean>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: number, message: Partial<InsertContactMessage>): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
  getGoogleSettings(): Promise<GoogleSettings | undefined>;
  updateGoogleSettings(settings: Partial<InsertGoogleSettings>): Promise<GoogleSettings>;
  getScripts(): Promise<Scripts | undefined>;
  updateScripts(scriptsData: Partial<InsertScripts>): Promise<Scripts>;
}

export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser);
    const newUser = await this.getUser(Number(result[0].insertId));
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    await db.update(users).set(user).where(eq(users.id, id));
    return this.getUser(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result[0].affectedRows > 0;
  }

  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const result = await db.select().from(siteSettings).limit(1);
    return result[0];
  }

  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();

    if (existing) {
      await db.update(siteSettings).set(settings).where(eq(siteSettings.id, existing.id));
      const updated = await this.getSiteSettings();
      if (!updated) throw new Error("Failed to update site settings");
      return updated;
    } else {
      const result = await db.insert(siteSettings).values(settings);
      const newSettings = await this.getSiteSettings();
      if (!newSettings) throw new Error("Failed to create site settings");
      return newSettings;
    }
  }

  async getContacts(): Promise<Contacts | undefined> {
    const result = await db.select().from(contacts).limit(1);
    return result[0];
  }

  async updateContacts(contactsData: Partial<InsertContacts>): Promise<Contacts> {
    const existing = await this.getContacts();

    if (existing) {
      await db.update(contacts).set(contactsData).where(eq(contacts.id, existing.id));
      const updated = await this.getContacts();
      if (!updated) throw new Error("Failed to update contacts");
      return updated;
    } else {
      const result = await db.insert(contacts).values(contactsData);
      const newContacts = await this.getContacts();
      if (!newContacts) throw new Error("Failed to create contacts");
      return newContacts;
    }
  }

  async getAllServices(): Promise<Service[]> {
    return db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
    return result[0];
  }

  async createService(insertService: InsertService): Promise<Service> {
    const result = await db.insert(services).values({
      ...insertService,
      updatedAt: new Date(),
    });
    const newService = await this.getService(Number(result[0].insertId));
    if (!newService) {
      throw new Error("Failed to create service");
    }
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    await db.update(services).set({
      ...service,
      updatedAt: new Date(),
    }).where(eq(services.id, id));
    return this.getService(id);
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result[0].affectedRows > 0;
  }

  async getAllBanners(): Promise<Banner[]> {
    return db.select().from(banners);
  }

  async getBanner(id: number): Promise<Banner | undefined> {
    const result = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
    return result[0];
  }

  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const result = await db.insert(banners).values({
      ...insertBanner,
      updatedAt: new Date(),
    });
    const newBanner = await this.getBanner(Number(result[0].insertId));
    if (!newBanner) {
      throw new Error("Failed to create banner");
    }
    return newBanner;
  }

  async updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined> {
    await db.update(banners).set({
      ...banner,
      updatedAt: new Date(),
    }).where(eq(banners.id, id));
    return this.getBanner(id);
  }

  async deleteBanner(id: number): Promise<boolean> {
    const result = await db.delete(banners).where(eq(banners.id, id));
    return result[0].affectedRows > 0;
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return db.select().from(gallery);
  }

  async getGalleryItem(id: number): Promise<GalleryItem | undefined> {
    const result = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
    return result[0];
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const result = await db.insert(gallery).values({
      ...insertItem,
      updatedAt: new Date(),
    });
    const newItem = await this.getGalleryItem(Number(result[0].insertId));
    if (!newItem) {
      throw new Error("Failed to create gallery item");
    }
    return newItem;
  }

  async updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    await db.update(gallery).set({
      ...item,
      updatedAt: new Date(),
    }).where(eq(gallery.id, id));
    return this.getGalleryItem(id);
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await db.delete(gallery).where(eq(gallery.id, id));
    return result[0].affectedRows > 0;
  }

  async createSolicitacao(solicitacao: InsertSolicitacao): Promise<Solicitacao> {
    const [newSolicitacao] = await db.insert(solicitacoes).values(solicitacao);
    if (!newSolicitacao.insertId) {
      throw new Error("Failed to create solicitacao");
    }
    const result = await db.select().from(solicitacoes).where(eq(solicitacoes.id, newSolicitacao.insertId));
    if (!result[0]) {
      throw new Error("Failed to retrieve created solicitacao");
    }
    return result[0];
  }

  async getAllPages(): Promise<Page[]> {
    return db.select().from(pages);
  }

  async getPage(id: number): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    return result[0];
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    return result[0];
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const result = await db.insert(pages).values({
      ...insertPage,
      updatedAt: new Date(),
    });
    const newPage = await this.getPage(Number(result[0].insertId));
    if (!newPage) {
      throw new Error("Failed to create page");
    }
    return newPage;
  }

  async updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined> {
    await db.update(pages).set({
      ...page,
      updatedAt: new Date(),
    }).where(eq(pages.id, id));
    return this.getPage(id);
  }

  async deletePage(id: number): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id));
    return result[0].affectedRows > 0;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
    return result[0];
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(insertMessage);
    const newMessage = await this.getContactMessage(Number(result[0].insertId));
    if (!newMessage) {
      throw new Error("Failed to create contact message");
    }
    return newMessage;
  }

  async updateContactMessage(id: number, message: Partial<InsertContactMessage>): Promise<ContactMessage | undefined> {
    await db.update(contactMessages).set(message).where(eq(contactMessages.id, id));
    return this.getContactMessage(id);
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return result[0].affectedRows > 0;
  }

  async getGoogleSettings(): Promise<GoogleSettings | undefined> {
    const result = await db.select().from(googleSettings).limit(1);
    return result[0];
  }

  async updateGoogleSettings(settings: Partial<InsertGoogleSettings>): Promise<GoogleSettings> {
    const existing = await this.getGoogleSettings();

    if (existing) {
      await db.update(googleSettings).set(settings).where(eq(googleSettings.id, existing.id));
      const updated = await this.getGoogleSettings();
      if (!updated) throw new Error("Failed to update Google settings");
      return updated;
    } else {
      const result = await db.insert(googleSettings).values(settings);
      const newSettings = await this.getGoogleSettings();
      if (!newSettings) throw new Error("Failed to create Google settings");
      return newSettings;
    }
  }

  async getScripts(): Promise<Scripts | undefined> {
    const result = await db.select().from(scripts).limit(1);
    return result[0];
  }

  async updateScripts(scriptsData: Partial<InsertScripts>): Promise<Scripts> {
    const existing = await this.getScripts();

    if (existing) {
      await db.update(scripts).set(scriptsData).where(eq(scripts.id, existing.id));
      const updated = await this.getScripts();
      if (!updated) throw new Error("Failed to update scripts");
      return updated;
    } else {
      const result = await db.insert(scripts).values(scriptsData);
      const newScripts = await this.getScripts();
      if (!newScripts) throw new Error("Failed to create scripts");
      return newScripts;
    }
  }
}

export const storage = new DbStorage();
