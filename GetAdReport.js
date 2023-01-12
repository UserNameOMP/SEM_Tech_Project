const CONFIG = {
    "query" : `
        SELECT 
            customer.id, 
            campaign.id, 
            campaign.name, 
            ad_group.id, 
            ad_group.name, 
            ad_group_ad.ad.id, 
            ad_group_ad.ad.type, 
            ad_group_ad.ad.discovery_multi_asset_ad.headlines, 
            ad_group_ad.ad.discovery_multi_asset_ad.descriptions, 
            ad_group_ad.ad.expanded_dynamic_search_ad.description, 
            ad_group_ad.ad.expanded_dynamic_search_ad.description2, 
            ad_group_ad.ad.expanded_text_ad.headline_part1, 
            ad_group_ad.ad.expanded_text_ad.headline_part2, 
            ad_group_ad.ad.expanded_text_ad.headline_part3, 
            ad_group_ad.ad.expanded_text_ad.description, 
            ad_group_ad.ad.expanded_text_ad.description2, 
            ad_group_ad.ad.expanded_text_ad.path1, 
            ad_group_ad.ad.expanded_text_ad.path2, 
            ad_group_ad.ad.legacy_responsive_display_ad.short_headline, 
            ad_group_ad.ad.legacy_responsive_display_ad.long_headline, 
            ad_group_ad.ad.legacy_responsive_display_ad.description, 
            ad_group_ad.ad.local_ad.headlines, 
            ad_group_ad.ad.local_ad.descriptions, 
            ad_group_ad.ad.local_ad.path1, 
            ad_group_ad.ad.local_ad.path2, 
            ad_group_ad.ad.responsive_display_ad.headlines, 
            ad_group_ad.ad.responsive_display_ad.long_headline, 
            ad_group_ad.ad.responsive_display_ad.descriptions, 
            ad_group_ad.ad.responsive_search_ad.headlines, 
            ad_group_ad.ad.responsive_search_ad.descriptions, 
            ad_group_ad.ad.responsive_search_ad.path1, 
            ad_group_ad.ad.responsive_search_ad.path2, 
            ad_group_ad.ad.video_responsive_ad.headlines, 
            ad_group_ad.ad.video_responsive_ad.descriptions, 
            ad_group_ad.ad.video_responsive_ad.long_headlines,
            ad_group_ad.ad.text_ad.headline,
            ad_group_ad.ad.text_ad.description2,
            ad_group_ad.ad.text_ad.description1 
        FROM ad_group_ad 
        WHERE 
            campaign.status = 'ENABLED' 
            AND ad_group.status = 'ENABLED' 
            AND ad_group_ad.status = 'ENABLED'       
        `,
        "sheetURL": `https://docs.google.com/spreadsheets/d/1Ye-doPPleq-SmYR6FwVL9Jwa_CaXR6dy54-6dSRxqTU/`,
        "sheetName": `source`,
        "configSheetName": `setup`, 
        "languageSetup": `A2`
  }

// F - Function creates dictionary (Obj) of current set up languages.
function getLangSettings() {
    const campaigns = AdsApp.campaigns()
        .withCondition("campaign.status = 'ENABLED'")
        .get();
    
    let langDictionary = {};
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

        langDictionary[campaign_ID] = languageList;

    }
    
    return langDictionary;
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
          "Target language": langDictionary[row["campaign.id"]],
          "Language Required": adsLanguage
          
        }
      );
    }
  
    return result;
}
  
// F - Exporting New Report into Google Spreadsheet
function exportReport(sheet, spreadsheet, reportTable) {
    const report = reportTable;
  
    // Creating Headline for a report table, if it's empty
    if (!sheet.getLastRow()){
      sheet.appendRow(Object.keys(report[0]));
    }
    
    // Transforming Report from Object to Array for fast uploading
    let reportArray = [];
    for(const row of report){
        reportArray.push(Object.values(row));
    }
    
    // Set an empty range in Google Spreadsheet for uploading data from Array
    let range = sheet.getRange(2, 1,  (reportArray.length), (reportArray[0].length));
    range.setValues(reportArray); 
    
}
  
 /// F - Is needed for debugging some code 
function prettyPrint(obj){
    console.log(JSON.stringify(obj, null, 4));
}
    
function main() {
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.sheetURL);
    let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
    let range = sheet.getRange(2, 1,  sheet.getMaxRows() - 1, 32);
    range.clearContent();

    let setUpSheet = spreadsheet.getSheetByName(CONFIG.configSheetName);
    let setUpRange = setUpSheet.getRange(CONFIG.languageSetup);
    const adsLanguage = setUpRange.getValues();

    const report = AdsApp.report(CONFIG.query);
    let result = transformReport(report, adsLanguage);

//    prettyPrint(result);
    
    exportReport(sheet, spreadsheet, result);

}

/*
***** Info Part *****

Curent Script Version is working with next types of adds:

EXPANDED_DYNAMIC_SEARCH_AD
            ad_group_ad.ad.expanded_dynamic_search_ad.description, 
            ad_group_ad.ad.expanded_dynamic_search_ad.description2, 

EXPANDED_TEXT_AD
            ad_group_ad.ad.expanded_text_ad.headline_part1, 
            ad_group_ad.ad.expanded_text_ad.headline_part2, 
            ad_group_ad.ad.expanded_text_ad.headline_part3, 
            ad_group_ad.ad.expanded_text_ad.description, 
            ad_group_ad.ad.expanded_text_ad.description2, 
            ad_group_ad.ad.expanded_text_ad.path1, 
            ad_group_ad.ad.expanded_text_ad.path2, 

RESPONSIVE_DISPLAY_AD ->
             ad_group_ad.ad.responsive_display_ad.headlines, 
             ad_group_ad.ad.responsive_display_ad.long_headline, 
             ad_group_ad.ad.responsive_display_ad.descriptions, 

RESPONSIVE_SEARCH_AD
            ad_group_ad.ad.responsive_search_ad.headlines, 
            ad_group_ad.ad.responsive_search_ad.descriptions, 
            ad_group_ad.ad.responsive_search_ad.path1, 
            ad_group_ad.ad.responsive_search_ad.path2, 

TEXT_AD
             ad_group_ad.ad.text_ad.headline,
            ad_group_ad.ad.text_ad.description2,
            ad_group_ad.ad.text_ad.description1 

***** ----- *****

Upgoing types:

DISCOVERY_MULTI_ASSET_AD
            ad_group_ad.ad.discovery_multi_asset_ad.headlines, 
            ad_group_ad.ad.discovery_multi_asset_ad.descriptions, 

LEGACY_RESPONSIVE_DISPLAY_AD
            ad_group_ad.ad.legacy_responsive_display_ad.short_headline, 
            ad_group_ad.ad.legacy_responsive_display_ad.long_headline, 
            ad_group_ad.ad.legacy_responsive_display_ad.description, 

LOCAL_AD
            ad_group_ad.ad.local_ad.headlines, 
            ad_group_ad.ad.local_ad.descriptions, 
            ad_group_ad.ad.local_ad.path1, 
            ad_group_ad.ad.local_ad.path2, 

VIDEO_RESPONSIVE_AD
            ad_group_ad.ad.video_responsive_ad.headlines, 
            ad_group_ad.ad.video_responsive_ad.descriptions, 
            ad_group_ad.ad.video_responsive_ad.long_headlines,
 */