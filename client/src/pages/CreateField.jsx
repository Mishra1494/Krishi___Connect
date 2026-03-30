import React from 'react';
import { useTranslation } from 'react-i18next';
import FieldMapper from '../components/fields/FieldMapper';

const CreateField = () => {
  const { t } = useTranslation();
  return (
    <div className="create-field-page">
      <FieldMapper />
    </div>
  );
};

export default CreateField;
