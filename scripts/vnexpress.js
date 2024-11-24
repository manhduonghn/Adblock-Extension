// CSS rules to hide adblock button, overlay, and additional ad sections
const css = `
    .ads,
    .mb20,
    .wrap,
    .gopy-vne,
    .list-link,
    .banner-ads,
    .article_ads,
    .button-adblock,
    .guitoasoan_btn,
    .wrap-hd-adblock,
    .section-ads-top,
    .icon-podcast-pin,
    .slide-banner-ads,
    .box-newsletter-vne,
    .downloadapp.contact,
    .section_ads_300x250,
    .installvneapp--small,
    .social_info.width_common,
    .box-ebank-qt.box-category,
    .contact_info.width_common,
    .box-news-other-site.container,
    .vne_app.app_info.width_common,
    .clearfix.box_300_targer.section,
    .box-tvol-vs.has-border.box-category,
    .fs_parent_box.wrap-box-business.container,
    .coppy_right_info.width_common.newsletter_sidebar,
    .box-tvol-vs.box_category_v2.box_category.inner_section,
    .width_common.coppy_right_info.newsletters_footer_mb,
    div.width_common.menu_grid2:nth-of-type(3),
    ul.list-menu-footer:nth-of-type(5),
    div.width_common.menu_grid2:nth-of-type(25),
    #banner_top,
    #thongtindoanhnghiep,
    #box-raovat-v2-home-pc.box-raovat-v2.box-category,
    #raovat.box_category_v2.box_category.section,
    #footer > div.width_common.coppy_right_info > .vne_app.app_info.width_common {
        display: none !important;
    }
`;

// Create a <style> element
const style = document.createElement('style');
style.textContent = css;

// Inject the style into the HTML head to ensure persistence even when cached
document.documentElement.appendChild(style);
