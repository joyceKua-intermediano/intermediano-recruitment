'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">{t('pages.about.title')}</h1>
      <p className="mb-6">
        {t('pages.about.intro')}
      </p>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('pages.about.missionTitle')}</h2>
        <p>
          {t('pages.about.missionText')}
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('pages.about.valuesTitle')}</h2>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('pages.about.value1')}</li>
          <li>{t('pages.about.value2')}</li>
          <li>{t('pages.about.value3')}</li>
          <li>{t('pages.about.value4')}</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('pages.about.whyTitle')}</h2>
        <p>
          {t('pages.about.whyText')}
        </p>
      </section>
    </main>
  );
} 