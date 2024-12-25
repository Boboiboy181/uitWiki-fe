export type Document = {
  _id: string;
  documentKey: string;
  documentUrl: string;
  author: string;
  description: string;
  title: string;
  publicdate: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  isActive?: boolean;
};

export type DocumentResponse = {
  _id: string;
  documentKey: string;
  documentUrl: string;
  metadata: {
    title: string;
    author: string;
    description: string;
    publicdate: string;
  };
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
