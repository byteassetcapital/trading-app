import React from 'react';
import TextPageLayout from '@/components/TextPageLayout';

export default function RiskWarningPage() {
    return (
        <TextPageLayout title="Upozornění na rizika" subtitle="Obchodování s kryptoměnami a finančními deriváty nese vysoké riziko">
            <h2>1. Obecné upozornění</h2>
            <p>
                Společnost Byte Asset Capital upozorňuje, že obchodování s CFD kontrakty, kryptoměnami a jinými investičními nástroji je spojeno s vysokou mírou rizika a nemusí být vhodné pro všechny investory. Měli byste pečlivě zvážit své investiční cíle, úroveň zkušeností a ochotu riskovat.
            </p>

            <h2>2. Riziko ztráty kapitálu</h2>
            <p>
                Existuje možnost, že byste mohli utrpět ztrátu části nebo celého vašeho počátečního vkladu, a proto byste neměli investovat peníze, které si nemůžete dovolit ztratit. V případě pákového efektu může ztráta převýšit i původní vklad (pokud je to aplikovatelné).
            </p>

            <h2>3. Volatilita trhu</h2>
            <p>
                Trhy kryptoměn jsou extrémně volatilní a mohou být ovlivněny řadou externích faktorů, jako jsou finanční, regulační nebo politické události. Ceny mohou v krátkém čase výrazně kolísat.
            </p>

            <h2>4. Technická rizika</h2>
            <p>
                Využívání automatizovaných obchodních systémů a internetových platforem s sebou nese rizika spojená s hardwarem, softwarem a internetovým připojením. Společnost Byte Asset Capital nenese odpovědnost za komunikační selhání, zkreslení nebo zpoždění při obchodování přes internet.
            </p>

            <h2>5. Žádné investiční poradenství</h2>
            <p>
                Veškeré informace, analýzy nebo názory poskytované na této platformě jsou pouze obecného charakteru a nepředstavují investiční poradenství ani doporučení k nákupu či prodeji konkrétních aktiv.
            </p>
        </TextPageLayout>
    );
}
