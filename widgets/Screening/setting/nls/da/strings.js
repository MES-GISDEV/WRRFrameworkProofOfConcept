///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define({
  "units": {
    "standardUnit": "Standardenhed",
    "metricUnit": "Metrisk enhed"
  },
  "analysisTab": {
    "analysisTabLabel": "Analysis",
    "selectAnalysisLayerLabel": "Vælg analyselag",
    "addLayerLabel": "Tilføj lag",
    "noValidLayersForAnalysis": "Ingen gyldige lag fundet i det valgte webkort.",
    "noValidFieldsForAnalysis": "Ingen gyldige felter fundet i det valgte webkort. Fjern det valgte lag.",
    "addLayersHintText": "Tip: Vælg de lag og felter, der skal analyseres og vises i rapporten",
    "addLayerNameTitle": "Navn på lag",
    "addFieldsLabel": "Tilføj felt",
    "addFieldsPopupTitle": "Vælg felter",
    "addFieldsNameTitle": "Feltnavne",
    "aoiToolsLegendLabel": "AIO-værktøjer",
    "aoiToolsDescriptionLabel": "Aktivér værktøjer til at oprette interesseområder og angive deres etiketter",
    "placenameLabel": "Stednavn",
    "drawToolsLabel": "Tegneværktøjer",
    "uploadShapeFileLabel": "Overfør en shapefil",
    "coordinatesLabel": "Koordinater",
    "coordinatesDrpDwnHintText": "Tip: Vælg enhed til visning af de angivne traverser",
    "coordinatesBearingDrpDwnHintText": "Tip: Vælg pejling til visning af de angivne traverser",
    "allowShapefilesUploadLabel": "Tillad overførsel af shapefiler, der skal analyseres",
    "areaUnitsLabel": "Vis områder/længder i",
    "allowShapefilesUploadLabelHintText": "Tip: Vis 'Overfør shapefil i analyse' i rapportfanen",
    "maxFeatureForAnalysisLabel": "Maks. antal objekter til analyse",
    "maxFeatureForAnalysisHintText": "Tip: Angiv maks. antal objekter til analyse",
    "searchToleranceLabelText": "Søgetolerance (fod)",
    "searchToleranceHint": "Tip: Søgetolerancen anvendes kun, når der analyseres punkt- eller linjeangivelser"
  },
  "downloadTab": {
    "downloadLegend": "Download-indstillinger",
    "reportLegend": "Rapportindstillinger",
    "downloadTabLabel": "Hent",
    "syncEnableOptionLabel": "Vektorlag",
    "syncEnableOptionHint": "Tip: Benyttes til at downloade objektoplysninger for objekter, der gennemskærer interesseområdet, i de angivne formater.",
    "syncEnableOptionNote": "Bemærk: Der kræves synkroniseringsaktiverede featuretjenester til filgeodatabase-indstillingen.",
    "extractDataTaskOptionLabel": "Geoprocesseringstjenesten Udtræk dataopgave",
    "extractDataTaskOptionHint": "Tip: Brug en publiceret Udtræk dataopgave-geoprocesseringstjeneste til at downloade objekter, der gennemskærer interesseområdet i filgeodatabase- eller shapefil-format.",
    "cannotDownloadOptionLabel": "Deaktivér download",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Navn på lag",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "Filgeodatabase",
      "allowDownloadLabel": "Tillad download"
    },
    "setButtonLabel": "Indstil",
    "GPTaskLabel": "Angiv URL'en til geoprocesseringstjenesten",
    "printGPServiceLabel": "Udskriv tjeneste-URL",
    "setGPTaskTitle": "Angiv den krævede geoprocesseringstjeneste-URL",
    "logoLabel": "Logo",
    "logoChooserHint": "Tip: Klik på billedikonet for at redigere billedet",
    "footnoteLabel": "Fodnote",
    "columnTitleColorPickerLabel": "Farve på kolonnetitler",
    "reportTitleLabel": "Rapporttitel",
    "errorMessages": {
      "invalidGPTaskURL": "Ugyldig geoprocesseringstjeneste. Vælg en geoprocesseringstjeneste, der indeholder Udtræk dataopgave.",
      "noExtractDataTaskURL": "Vælg en vilkårlig geoprocesseringstjeneste, der indeholder Udtræk dataopgave."
    }
  },
  "generalTab": {
    "generalTabLabel": "Generelt",
    "tabLabelsLegend": "Paneletiketter",
    "tabLabelsHint": "Tip: Angiv etiketter",
    "AOITabLabel": "Interesseområde-panel",
    "ReportTabLabel": "Rapportpanel",
    "bufferSettingsLegend": "Bufferindstillinger",
    "defaultBufferDistanceLabel": "Standardbufferafstand",
    "defaultBufferUnitsLabel": "Bufferenheder",
    "generalBufferSymbologyHint": "Tip: Angiv den symbologi, der skal benyttes til at vise buffere omkring definerede interesseområder",
    "aoiGraphicsSymbologyLegend": "AOI-grafiksymbologi",
    "aoiGraphicsSymbologyHint": "Tip: Angiv den symbologi, der skal benyttes til at definere punkt-, linje- og polygon-interesserområder",
    "pointSymbologyLabel": "Punkt",
    "previewLabel": "Eksempel",
    "lineSymbologyLabel": "Linje",
    "polygonSymbologyLabel": "Polygon",
    "aoiBufferSymbologyLabel": "Buffersymbologi",
    "pointSymbolChooserPopupTitle": "Adresse- eller positionssymbol",
    "polygonSymbolChooserPopupTitle": "Vælg symbol for at fremhæve polygon",
    "lineSymbolChooserPopupTitle": "Vælg symbol for at fremhæve linje",
    "aoiSymbolChooserPopupTitle": "Indstil buffersymbol"
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Søgekildeindstillinger",
    "searchSourceSettingTitle": "Søgekildeindstillinger",
    "searchSourceSettingTitleHintText": "Tilføj og konfigurér geokodningstjenester eller vektorlag som søgekilder. Disse specificerede kilder bestemmer, hvad der kan søges efter i søgeboksen.",
    "addSearchSourceLabel": "Tilføj søgekilde",
    "featureLayerLabel": "Vektorlag",
    "geocoderLabel": "Geokoder",
    "generalSettingLabel": "Generel indstilling",
    "allPlaceholderLabel": "Pladsholdertekst for søgning efter alle:",
    "allPlaceholderHintText": "Tip: Indtast den tekst, der skal vises som pladsholder, mens der søges i alle lag og geokoder",
    "generalSettingCheckboxLabel": "Vis pop-up for det fundne objekt eller den fundne position",
    "countryCode": "Lande- eller regionskode(r)",
    "countryCodeEg": "f.eks. ",
    "countryCodeHint": "Hvis denne værdi er tom, bliver der søgt efter alle lande og regioner",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Søg kun inden for den aktuelle kortudstrækning",
    "zoomScale": "Zoom-skala",
    "locatorUrl": "Geokodnings-URL",
    "locatorName": "Navn på geokodningsfunktion",
    "locatorExample": "Eksempel",
    "locatorWarning": "Denne version af geokodningstjenesten understøttes ikke. Widget'en understøtter Geokodningstjeneste version 10.0 og nyere.",
    "locatorTips": "Forslag er ikke tilgængelige, fordi geokodningstjenesten ikke understøtter forslagsfunktionen.",
    "layerSource": "Lagkilde",
    "setLayerSource": "Angiv lagkilde",
    "setGeocoderURL": "Angiv geokodnings-URL",
    "searchLayerTips": "Forslag er ikke tilgængelige, fordi featuretjenesten ikke understøtter forslagsfunktionen.",
    "placeholder": "Pladsholdertekst",
    "searchFields": "Søgefelter",
    "displayField": "Visningsfelt:",
    "exactMatch": "Nøjagtigt match",
    "maxSuggestions": "Maksimalt antal forslag",
    "maxResults": "Maksimalt antal resultater",
    "enableLocalSearch": "Aktivér lokal søgning",
    "minScale": "Min. målestok",
    "minScaleHint": "Når kortmålestokken er større end denne målstok, anvendes lokal søgning",
    "radius": "Radius",
    "radiusHint": "Angiver radius for et område omkring det aktuelle kortcentrum, der benyttes til at booste rangordningen af geokodningsforslag, så de forslag, der ligger tættest på placeringen, returneres først",
    "setSearchFields": "Indstil søgefelter",
    "set": "Indstil",
    "invalidUrlTip": "URL’en ${URL} er ugyldig eller utilgængelig.",
    "invalidSearchSources": "Ugyldige søgekildeindstillinger"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Udfyld de obligatoriske felter",
    "bufferDistanceFieldsErrorMsg": "Angiv gyldige værdier",
    "invalidSearchToleranceErrorMsg": "Angiv en gyldig værdi for søgetolerance",
    "atLeastOneCheckboxCheckedErrorMsg": "Ugyldig konfiguration",
    "noLayerAvailableErrorMsg": "Ingen lag tilgængelige",
    "layerNotSupportedErrorMsg": "Understøttes ikke ",
    "noFieldSelected": "Brug redigeringshandlingen til at vælge felter til analyse.",
    "duplicateFieldsLabels": "Dobbeltforekomst af etiketten \"${labelText}\" er tilføjet til: \"${itemNames}\"",
    "noLayerSelected": "Vælg mindst ét lag til analyse",
    "errorInSelectingLayer": "Kan ikke fuldføre handlingen for det valgte lag. Prøv igen.",
    "errorInMaxFeatureCount": "Angiv et gyldigt maks. antal objekter til analysen."
  }
});