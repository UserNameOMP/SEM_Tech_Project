const CONFIG = {
        "sheetURL": `https://docs.google.com/spreadsheets/d/1Ye-doPPleq-SmYR6FwVL9Jwa_CaXR6dy54-6dSRxqTU/`,
        "sheetName": `source`,
        "sheetLangName": `source`,
        "configSheetName": `setup`, 
        "languageSetup": `A2`
  }

  const QUERY = {
    "ad_group_ad" : `
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
        `
  }