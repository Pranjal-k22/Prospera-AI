'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LANDING_IMAGES } from '@/lib/landing-images';
import { PropertyDetailModal } from '@/components/landing/PropertyDetailModal';

export default function StandalonePropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const property =
    LANDING_IMAGES.properties.find((p) => p.id === id) ||
    LANDING_IMAGES.properties[0];

  const handleClose = () => {
    router.push('/');
  };

  const handleSelectSimilar = (newProp: { id: string }) => {
    router.push(`/homes/${newProp.id}`);
  };

  return (
    <PropertyDetailModal
      property={property}
      originRect={null}
      onClose={handleClose}
      onSelectSimilarProperty={handleSelectSimilar}
    />
  );
}
