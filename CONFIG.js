const CONFIG = {
        "sheetURL": `https://docs.google.com/spreadsheets/d/1Ye-doPPleq-SmYR6FwVL9Jwa_CaXR6dy54-6dSRxqTU/`,
        "sheetName": `source`,
        "sheetLangName": `Lang`,
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
            AND ad_group_ad.ad.type NOT IN ('APP_AD', 'APP_ENGAGEMENT_AD', 'APP_PRE_REGISTRATION_AD', 'CALL_AD', 'DISCOVERY_CAROUSEL_AD', 'DISCOVERY_MULTI_ASSET_AD', 'DYNAMIC_HTML5_AD', 'HOTEL_AD', 'HTML5_UPLOAD_AD', 'IMAGE_AD', 'IN_FEED_VIDEO_AD', 'LEGACY_APP_INSTALL_AD', 'LEGACY_RESPONSIVE_DISPLAY_AD', 'LOCAL_AD', 'SHOPPING_COMPARISON_LISTING_AD', 'SHOPPING_PRODUCT_AD', 'SHOPPING_SMART_AD', 'UNKNOWN', 'VIDEO_AD', 'VIDEO_BUMPER_AD', 'VIDEO_NON_SKIPPABLE_IN_STREAM_AD', 'VIDEO_OUTSTREAM_AD', 'VIDEO_TRUEVIEW_IN_STREAM_AD')        
        `
  }