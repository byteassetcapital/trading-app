
import React from 'react';
import TextPageLayout from '@/components/TextPageLayout';

export default function SupportPage() {
    return (
        <TextPageLayout title="Podpora" subtitle="Jsme tu pro vás, kdykoliv potřebujete pomoci">
            <h2>Kontaktní údaje</h2>
            <p>
                Potřebujete poradit s nastavením účtu nebo máte technický dotaz? Náš tým podpory je připraven vám pomoci.
            </p>
            <ul>
                <li><strong>E-mail:</strong> info@byteassetcapital.com</li>

                <li><strong>Adresa:</strong>  Benešov 26, 547 01 Benešov</li>
            </ul>

            <h2>Často kladené dotazy (FAQ)</h2>
            <p>
                Než nás budete kontaktovat, zkuste se podívat do naší sekce nápovědy, kde najdete odpovědi na nejčastější dotazy ohledně registrace, vkladů a nastavení botů.
            </p>

            <h2>Mimosoudní řešení sporů</h2>
            <p>
                V případě spotřebitelského sporu, který se nepodaří vyřešit vzájemnou dohodou, má spotřebitel právo na mimosoudní řešení sporu u České obchodní inspekce www.coi.cz.
            </p>
        </TextPageLayout>
    );
}
