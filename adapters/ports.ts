import { Page } from "../entities/page";

export interface GetPageService {
    getPages(app_id: string): Promise<Page[]>
}

export interface CreatePageService {
    createPage(app_id: string, prev_page_id: string): void
}

export interface PageStorageService {
    pages: Page[];
    setPages(pages: Page[]): void;
  }