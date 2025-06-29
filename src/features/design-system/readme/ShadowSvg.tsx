import React from "react";
import { DesignSystem, Shadows } from "../../../domain/DesignSystemDomain";
import { getShadowColor } from "../../../util/DesignSystemUtils";

function ShadowSvg({shadows, designSystem}:{shadows: Shadows, designSystem: DesignSystem}) {
  const { shadowName, shadowsArray } = shadows;

  return (
    <defs>
      <filter
        id={shadowName}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="userSpaceOnUse"
      >
        {shadowsArray.map((shadow, i) => {
          const {
            shadowX,
            shadowY,
            blur,
            spread,
            color,
            colorOpacity,
            inset,
          } = shadow;

          const computeColor = getShadowColor({
            shadowColor: color,
            designSystem
          })

          if (!inset) {
            // DROP SHADOW
            // 1) Dilater la forme de base par le spread
            // 2) Décaler par shadowX/shadowY
            // 3) Flouter avec blur
            // 4) Appliquer la couleur + opacité
            // 5) Masquer la couleur dans la zone floutée
            // 6) Donner un résultat "shadow{i}"
            return (
              <React.Fragment key={`shadow-${i}`}>
                <feMorphology
                  in="SourceAlpha"
                  operator="dilate"
                  radius={spread}
                  result={`spread${i}`}
                />
                <feOffset
                  in={`spread${i}`}
                  dx={shadowX}
                  dy={shadowY}
                  result={`offset${i}`}
                />
                <feGaussianBlur
                  in={`offset${i}`}
                  stdDeviation={blur}
                  result={`blur${i}`}
                />
                <feFlood
                  floodColor={computeColor}
                  floodOpacity={colorOpacity}
                  result={`color${i}`}
                />
                <feComposite
                  in={`color${i}`}
                  in2={`blur${i}`}
                  operator="in"
                  result={`shadow${i}`}
                />
              </React.Fragment>
            );
          } else {
            // INNER SHADOW (ombre intérieure)
            // 1) Flouter la SourceAlpha pour générer un dégradé interne
            // 2) Décaler ce flou
            // 3) Créer un masque en soustrayant la SourceAlpha de la partie floutée décalée
            // 4) Appliquer la couleur + opacité sur ce masque
            // 5) Donner un résultat "inner{i}"
            return (
              <React.Fragment key={`shadow-${i}`}>
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation={blur}
                  result={`inner-blur${i}`}
                />
                <feOffset
                  in={`inner-blur${i}`}
                  dx={shadowX}
                  dy={shadowY}
                  result={`inner-offset${i}`}
                />
                <feComposite
                  in={`inner-offset${i}`}
                  in2="SourceAlpha"
                  operator="arithmetic"
                  k2={-1}
                  k3={1}
                  result={`inner-mask${i}`}
                />
                <feFlood
                  floodColor={color}
                  floodOpacity={colorOpacity}
                  result={`inner-color${i}`}
                />
                <feComposite
                  in={`inner-color${i}`}
                  in2={`inner-mask${i}`}
                  operator="in"
                  result={`inner${i}`}
                />
              </React.Fragment>
            );
          }
        })}

        {/* Fusionner toutes les ombres, puis remettre le graphique original au-dessus */}
        <feMerge>
          {shadowsArray.map((shadow, i) => {
            if (!shadow.inset) {
              return <feMergeNode key={`merge-drop-${i}`} in={`shadow${i}`} />;
            }
            return null;
          })}

          <feMergeNode in="SourceGraphic" />

          {shadowsArray.map((shadow, i) => {
            if (shadow.inset) {
              return <feMergeNode key={`merge-inner-${i}`} in={`inner${i}`} />;
            }
            return null;
          })}
        </feMerge>
      </filter>
    </defs>
  );
};

export default ShadowSvg;
