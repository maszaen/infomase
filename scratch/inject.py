import re
L = open(r'backend-ci4/public/assets/web/animation/index.html', encoding='utf-8').read().split('\n')
m = '\n'.join(L[350:461])
for a, b in [('lightsInner', 'heroLightsInner'), ('keyCore', 'heroKeyCore'), ('id="key"', 'id="heroKey"'),
             ('id="shade"', 'id="heroShade"'), ('boostL', 'heroBoostL'), ('boostR', 'heroBoostR'),
             ('id="fans"', 'id="heroFans"'), ('id="bokeh"', 'id="heroBokeh"'), ('id="particles"', 'id="heroParticles"')]:
    m = m.replace(a, b)
m = '<div class="lp-hero-scene" id="heroScene" aria-hidden="true">\n' + m + '\n</div>\n'
p = r'backend-ci4/app/Views/web/landing.php'
s = open(p, encoding='utf-8').read()
old = re.search(r'<section class="lp-hero" style="[^"]*">\r?\n', s).group(0)
s = s.replace(old, '<section class="lp-hero">\n' + m, 1)
tag = "<?= $this->endSection() ?>"
s = s.replace(tag, "<script src=\"<?= base_url('assets/web/js/hero-animation.js?v=1') ?>\" defer></script>\n" + tag)
open(p, 'w', encoding='utf-8').write(s)
print(s.count('heroScene'), s.count('hero-animation.js'))
