export type Document = {
  _id: string;
  documentKey: string;
  documentUrl: string;
  author: string;
  description: string;
  title: string;
  publicdate: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  isActive?: boolean;
};
