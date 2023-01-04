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
        "sheetURL": `https://docs.google.com/spreadsheets/d/17bIUO95BcN2yBA2ZoWnSAfRnvKVd73AvIy7_Ho7B_Bs/`,
        "sheetName": `Debug_Report`
  }
  
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
  
function transformReport(report){
    
    const result = [];
  
    const rows = report.rows();
    while (rows.hasNext()) {
  
        let row = rows.next();

//        prettyPrint(row);

        let headlineRow = {};
        let descriptionRow = {};    
        let pathRow = {};
        let longHeadline = {};

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
        } else {
            console.log("I don't know what it is");
  }

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
          ...longHeadline
          
        }
      );
    }
  
    return result;
  }
  
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
    var range = sheet.getRange((sheet.getLastRow() + 1), 1,  (reportArray.length), (reportArray[0].length));
    range.setValues(reportArray); 
    
  }
  
  
  function prettyPrint(obj){
    console.log(JSON.stringify(obj, null, 4));
  }
  
  
  function main() {
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.sheetURL);
    let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
    sheet.clearContents();
    
    const report = AdsApp.report(CONFIG.query);
    let result = transformReport(report);
//    prettyPrint(result);
    
//  report.exportToSheet(sheet);
    
    exportReport(sheet, spreadsheet, result);
  }
