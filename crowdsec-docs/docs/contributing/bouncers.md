---
id: contributing_bouncers
title: Bouncers
sidebar_position: 5
---

# Publishing bouncers

We do welcome bouncers from the community, and will gladly publish them on the hub.

## Why ?

Sharing your bouncer on the hub allows other users to find it and use it. While increasing your code's visibility, it ensures as well a benevolent look from the community and the team over it.

## How ?

To have your bouncer published on the hub, please simply [open a new issue on the hub](https://github.com/crowdsecurity/hub/issues/new), requesting "bouncer inclusion". The bouncer will then be reviewed by the team, and then will be published directly on the hub, for everyone to find & use it !


The information that should be stated in your issue is :

 - The source repository of your bouncer (for example `https://github.com/crowdsecurity/cs-firewall-bouncer/`)
 - The software licence used
 - The current status of the bouncer (stage : dev/unstable/stable)
 - Documentation (can be simply in the README.md) :
    - must contains : installing, uninstalling
    - should contains : configuration documentation 
 - Link to existing tests if applicable (functional tests or unit tests)

Please take care of the following :

 - Ensure your repository has a About/Short description meaningful enough : it will be displayed in the hub
 - Ensure your repository has a decent README.md file : it will be displayed in the hub
 - Ensure your repository has *at least* one release : this is what users will be looking for
 - (ideally) Have a "social preview image" on your repository : this will be displayed in the hub when available
 - (ideally) A Howto or link to guide that provides a hands-on experience with the bouncer


Please find below a template :

```markdown
Hello,

I would like to suggest the addition of the `XXXX` to the hub :

 - Source repository: https://github.com/xxx/xxx/
 - Licence : MIT
 - Current status : stable (has been used in production for a while)
 - README/doc : https://github.com/xxx/xxx/blob/main/README.md
 - Existing tests :
    - functional tests : https://github.com/xxx/xxx/blob/main/.github/workflows/tests.yml

 - Short/Long description : OK
 - Howto : in README
 - At least one release : yes

```

