module.exports = function () {
    const isProd = process.env.NODE_ENV === "production"

    return {
        name: "docusaurus-plugin-leadfeeder",
        injectHtmlTags() {
            if (!isProd) {
                return {}
            }
            return {
                headTags: [
                    {
                        tagName: "script",
                        innerHTML: `
              window.ldfdr=window.ldfdr||function(){(ldfdr._q=ldfdr._q||[]).push([].slice.call(arguments));};
              (function(d,s){
                var fs=d.getElementsByTagName(s)[0];
                var cs=d.createElement(s);
                cs.src='https://sc.lfeeder.com/lftracker_v1_lAxoEaKqxpv7OYGd.js';
                cs.async=1;
                fs.parentNode.insertBefore(cs,fs);
              })(document,'script');
            `,
                    },
                ],
            }
        },
    }
}
