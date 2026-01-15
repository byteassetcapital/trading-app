import React from 'react';
import TextPageLayout from '@/components/TextPageLayout';

export default function AboutPage() {
    return (
        <TextPageLayout title="O nás" subtitle="Měníme způsob, jakým lidé obchodují">
            <h2>Naše mise</h2>
            <p>
                [DOPLNIT NÁZEV SPOLEČNOSTI] je technologická společnost zaměřená na vývoj pokročilých nástrojů pro automatizované obchodování. Naším cílem je zpřístupnit profesionální tradingové strategie i běžným uživatelům prostřednictvím intuitivní platformy.
            </p>

            <h2>Kdo jsme</h2>
            <p>
                Jsme tým nadšenců do financí, technologií a umělé inteligence. Věříme, že budoucnost financí je v automatizaci a chytrých algoritmech, které dokáží efektivně reagovat na tržní příležitosti 24/7.
            </p>

            <h2>Naše hodnoty</h2>
            <ul>
                <li><strong>Transparentnost:</strong> Hrajeme fér a neskrýváme žádné poplatky ani rizika.</li>
                <li><strong>Inovace:</strong> Neustále vylepšujeme naše algoritmy a platformu.</li>
                <li><strong>Bezpečnost:</strong> Ochrana prostředků a dat našich klientů je pro nás prioritou číslo jedna.</li>
            </ul>

            <h2>Kontaktujte nás</h2>
            <p>
                Máte dotazy nebo zájem o spolupráci? Napište nám na [DOPLNIT KONTAKTNÍ E-MAIL] nebo navštivte naši sekci Podpora.
            </p>
        </TextPageLayout>
    );
}
