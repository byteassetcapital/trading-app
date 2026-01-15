import React from 'react';
import TextPageLayout from '@/components/TextPageLayout';

export default function PrivacyPage() {
    return (
        <TextPageLayout title="Zásady ochrany osobních údajů" subtitle="Jak zpracováváme a chráníme vaše data">
            <h2>1. Správce osobních údajů</h2>
            <p>
                Správcem vašich osobních údajů je společnost Byte Asset Capital, se sídlem  Benešov 26, 547 01 Benešov, IČO: 13196146. Vaše soukromí bereme vážně a dbáme na bezpečnost vašich dat v souladu s GDPR a dalšími právními předpisy.
            </p>

            <h2>2. Jaké údaje shromažďujeme</h2>
            <p>
                Zpracováváme údaje, které nám poskytnete při registraci (jméno, e-mail, telefon) a údaje o vašem používání našich služeb (IP adresa, logy, historie transakcí). Tyto údaje jsou nezbytné pro poskytování našich služeb a plnění zákonných povinností.
            </p>

            <h2>3. Účel zpracování</h2>
            <p>
                Vaše údaje využíváme k:
            </p>
            <ul>
                <li>Poskytování a správě vašeho uživatelského účtu.</li>
                <li>Zlepšování našich služeb a technické podpoře.</li>
                <li>Komunikaci s vámi ohledně novinek a změn v našich službách (pokud jste k tomu dali souhlas).</li>
                <li>Plnění zákonných povinností (např. v oblasti AML/KYC).</li>
            </ul>

            <h2>4. Zabezpečení dat</h2>
            <p>
                Implementujeme technická a organizační opatření k ochraně vašich údajů před neoprávněným přístupem, ztrátou nebo zničením. Využíváme šifrování a bezpečné servery.
            </p>

            <h2>5. Vaše práva</h2>
            <p>
                Máte právo na přístup ke svým údajům, jejich opravu, výmaz ("právo být zapomenut"), omezení zpracování a přenositelnost údajů. Pro uplatnění těchto práv nás kontaktujte na info@byteassetcapital.com.
            </p>
        </TextPageLayout>
    );
}
