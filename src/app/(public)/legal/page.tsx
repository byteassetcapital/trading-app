import React from 'react';
import TextPageLayout from '@/components/TextPageLayout';

export default function LegalPage() {
    return (
        <TextPageLayout title="Právní informace" subtitle="Důležité právní doložky a informace o společnosti">
            <h2>Identifikační údaje</h2>
            <p>
                <strong>Název společnosti:</strong> Byte Asset Capital<br />
                <strong>Sídlo:</strong> Benešov 26, 547 01 Benešov<br />
                <strong>IČO:</strong> 13196146<br />

            </p>

            <h2>Omezení odpovědnosti</h2>
            <p>
                Obsah těchto webových stránek má pouze informativní charakter. Společnost Byte Asset Capital nenese odpovědnost za případné nepřesnosti nebo chyby v obsahu, ani za škody vzniklé použitím informací z těchto stránek.
            </p>

            <h2>Autorská práva</h2>
            <p>
                Veškerý obsah na těchto stránkách, včetně textů, designu, log a softwaru, je chráněn autorským právem a je majetkem společnosti Byte Asset Capital nebo jejích licensorů. Jakékoli kopírování či šíření bez souhlasu je zakázáno.
            </p>

            <h2>Rozhodné právo</h2>
            <p>
                Vztahy mezi vámi a společností se řídí právním řádem České republiky.
            </p>
        </TextPageLayout>
    );
}
