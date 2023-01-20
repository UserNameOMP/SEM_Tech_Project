// F - Function creates dictionary (Obj) of current set up languages.
function getLangSettings(adsLanguage) {
    const campaigns = AdsApp.campaigns()
        .withCondition("campaign.status = 'ENABLED'")
        .get();
    
    const result = []; 

    while (campaigns.hasNext()){
        const campaign = campaigns.next();
        const campaign_name = campaign.getName();
        const campaign_ID = campaign.getId();
        const languages = campaign.targeting().languages().get();
        let languageList = [];
        if (languages.hasNext()) {
            while (languages.hasNext()) {
                const language = languages.next();
                const language_name = language.getName();
                const language_id = language.getId();
                languageList.push(language_name);
            }
        } else {
            languageList = ["All"];
        };

        result.push(
            {
              "Campaign_ID": campaign_ID,
              "Campaign": campaign_name,
              "Target_language": languageList.toString(),
              "Language_Required": adsLanguage
              
            }
          );

    }
    
    result.sort( (a,b) => a.Target_language - b.Target_language );

    return result;
}
  
// F - This function transform adaptive ads types to unit with regular Ads form
function transformAds (list, type) {
    let obj = {};
    let quantity;
    if (type === "Headline") {
        quantity = 15;
    } else if (type === "Description") {
        quantity = 5;
    } else {
        console.log("Error in List Type - transformAds");
    }
    
    for (let row = 0; row < quantity; row++){
      let rowCounter = type + " " + (parseInt(row) + 1);
      if (!!list[row]) {
        if (!!list[row]["text"]) {
            obj[rowCounter] = list[row]["text"]
        } else {
            obj[rowCounter] = list[row]
        }
      } else {
        obj[rowCounter] = ""
      }
      
    }
    
    return obj;
}

// F - This function detects Ads types and creates the report structure required for Google Spreadsheets
function transformReport(report, adsLanguage){
    const result = [];
    const langDictionary = getLangSettings();
    const rows = report.rows();
    while (rows.hasNext()) {
        let row = rows.next();
        let headlineRow = {};
        let descriptionRow = {};    
        let pathRow = {};
        let longHeadline = {};

        // Ads Types Detection
        if (row["ad_group_ad.ad.type"] === "RESPONSIVE_SEARCH_AD") {
            headlineRow = transformAds(row["ad_group_ad.ad.responsive_search_ad.headlines"], "Headline");
            descriptionRow = transformAds(row["ad_group_ad.ad.responsive_search_ad.descriptions"], "Description");    
            pathRow = {
                "Path 1": row["ad_group_ad.ad.responsive_search_ad.path1"],
                "Path 2": row["ad_group_ad.ad.responsive_search_ad.path2"]
            };
            longHeadline = {
                "Long Headline": ""
            };
        } else if (row["ad_group_ad.ad.type"] === "EXPANDED_TEXT_AD"){
            headlineRow = transformAds([
                row["ad_group_ad.ad.expanded_text_ad.headline_part1"], 
                row["ad_group_ad.ad.expanded_text_ad.headline_part2"], 
                row["ad_group_ad.ad.expanded_text_ad.headline_part3"],
            ], "Headline");
            descriptionRow = transformAds([
                row["ad_group_ad.ad.expanded_text_ad.description"],
                row["ad_group_ad.ad.expanded_text_ad.description2"]
            ], "Description");    
            pathRow = {
                "Path 1": row["ad_group_ad.ad.expanded_text_ad.path1"],
                "Path 2": row["ad_group_ad.ad.expanded_text_ad.path2"]
            };
            longHeadline = {
                "Long Headline": ""
            };
        } else if (row["ad_group_ad.ad.type"] === "TEXT_AD") {
            headlineRow = transformAds([
                row["ad_group_ad.ad.text_ad.headline"]
            ], "Headline");
            descriptionRow = transformAds([
                row["ad_group_ad.ad.text_ad.description1"],
                row["ad_group_ad.ad.text_ad.description2"]
            ], "Description");    
            pathRow = {
                "Path 1": "",
                "Path 2": ""
            };
            longHeadline = {
                "Long Headline": ""
            };
        } else if (row["ad_group_ad.ad.type"] === "EXPANDED_DYNAMIC_SEARCH_AD") {
            headlineRow = transformAds([
                ""
            ], "Headline");
            descriptionRow = transformAds([
                row["ad_group_ad.ad.expanded_dynamic_search_ad.description"],
                row["ad_group_ad.ad.expanded_dynamic_search_ad.description2"]
            ], "Description");    
            pathRow = {
                "Path 1": "",
                "Path 2": ""
            };
            longHeadline = {
                "Long Headline": ""
            };
        } else if (row["ad_group_ad.ad.type"] === "RESPONSIVE_DISPLAY_AD") {
            headlineRow = transformAds(row["ad_group_ad.ad.responsive_display_ad.headlines"], "Headline");
            descriptionRow = transformAds(row["ad_group_ad.ad.responsive_display_ad.descriptions"], "Description");    
            pathRow = {
                "Path 1": "",
                "Path 2": ""
            };
            longHeadline = {
                "Long Headline": row["ad_group_ad.ad.responsive_display_ad.long_headline"]
            };

        } else if (row["ad_group_ad.ad.type"] === "VIDEO_RESPONSIVE_AD") {
            headlineRow = transformAds(row["ad_group_ad.ad.video_responsive_ad.headlines"], "Headline");
            descriptionRow = transformAds(row["ad_group_ad.ad.video_responsive_ad.descriptions"], "Description");    
            pathRow = {
                "Path 1": "",
                "Path 2": ""
            };
            longHeadline = {
                "Long Headline": row["ad_group_ad.ad.video_responsive_ad.long_headlines"]
            };

        } else {
            console.log("I don't know what it is");
            headlineRow = transformAds([
                ""
            ], "Headline");
            descriptionRow = transformAds([
                ""
            ], "Description");    
            pathRow = {
                "Path 1": "",
                "Path 2": ""
            };
            longHeadline = {
                "Long Headline": `I don't how to work with ${row["ad_group_ad.ad.type"]}`
            };
        }

      // Creating report structure  
      result.push(
        {
          "Account ID": row["customer.id"],
          "Campaign ID": row["campaign.id"],
          "Campaign": row["campaign.name"],
          "Ad Group ID": row["ad_group.id"],
          "Ad Group": row["ad_group.name"],
          "Ad ID": row["ad_group_ad.ad.id"],
          "Ad Type": row["ad_group_ad.ad.type"],
          ...headlineRow,
          ...descriptionRow,
          ...pathRow,
          ...longHeadline,
          "Language Required": adsLanguage
          
        }
      );
    }
  
    return result;
}
  
// F - Exporting New Report into Google Spreadsheet
function exportReport(sheet, reportTable) {
    const report = reportTable;
    
    // Transforming Report from Object to Array for fast uploading
    let reportArray = [];
    for(const row of report){
        reportArray.push(Object.values(row));
    }
    
    let range = sheet.getRange(1, 1, 1, (reportArray[0].length));
    range.setValues([Object.keys(report[0])]);

    // Set an empty range in Google Spreadsheet for uploading data from Array
    range = sheet.getRange(2, 1,  (reportArray.length), (reportArray[0].length));
    range.setValues(reportArray); 
    
}

function getEmtyRange(sheetURL, sheetName, reportData) {
    const spreadsheet = SpreadsheetApp.openByUrl(sheetURL);
    let sheet = spreadsheet.getSheetByName(sheetName);
    let range = sheet.getRange(2, 1,  sheet.getMaxRows() - 1, Object.keys(reportData[0]).length);
    range.clearContent();
    return sheet;
}

 /// F - Is needed for debugging some code 
function prettyPrint(obj){
    console.log(JSON.stringify(obj, null, 4));
}
    
function main() {
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.sheetURL);

    let setUpSheet = spreadsheet.getSheetByName(CONFIG.configSheetName);
    let setUpRange = setUpSheet.getRange(CONFIG.languageSetup);
    const adsLanguage = setUpRange.getValues();

    const report = AdsApp.report(QUERY.ad_group_ad);
    
    let result = transformReport(report, adsLanguage);
    let sheet = getEmtyRange(CONFIG.sheetURL, CONFIG.sheetName, result)
    exportReport(sheet, result);
//    prettyPrint(result);

    // шматок коду для мов
    result = getLangSettings(adsLanguage)
    sheet = getEmtyRange(CONFIG.sheetURL, CONFIG.sheetLangName, result)
    exportReport(sheet, result)
//    prettyPrint(result);

}
