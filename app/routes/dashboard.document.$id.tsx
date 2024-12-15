// dashboard.document.$id.tsx

import { useParams } from '@remix-run/react';

const DocumentDetailPage = () => {
  const { id } = useParams(); // Accessing the dynamic parameter `id`

  return <div>Document ID: {id}</div>;
};

export default DocumentDetailPage;
