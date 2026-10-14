'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CareersPage() {
  const { t } = useTranslation()
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">{t('pages.careers.title')}</h1>
      <p className="mb-6">
        {t('pages.careers.intro')}
      </p>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('pages.careers.openTitle')}</h2>
        <p>{t('pages.careers.openText')} <a href="mailto:hr@intermediano.com" className="text-primary underline">hr@intermediano.com</a> {t('pages.careers.openTextEnd')}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('pages.careers.whyTitle')}</h2>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>{t('pages.careers.why1')}</li>
          <li>{t('pages.careers.why2')}</li>
          <li>{t('pages.careers.why3')}</li>
          <li>{t('pages.careers.why4')}</li>
        </ul>
      </section>
    </main>
  );
} 