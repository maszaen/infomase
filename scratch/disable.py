import re
p = 'backend-ci4/app/Views/web/landing.php'
s = open(p, encoding='utf-8').read()
s = re.sub(r'<script src="<\?= base_url\([^\n]*hero-animation\.js[^\n]*\n', '', s)
open(p, 'w', encoding='utf-8').write(s)
c = open('cdn-vault/console-core.css', encoding='utf-8').read()
c = c.rstrip() + '''

/* Hero scene: semua animasi dimatikan (performa) - gradien statis saja */
.lp-hero-scene, .lp-hero-scene * { animation: none !important; transition: none !important; }
.lp-hero-scene .particles, .lp-hero-scene .bokeh, .lp-hero-scene .key, .lp-hero-scene .key-core,
.lp-hero-scene .fans, .lp-hero-scene .sweep, .lp-hero-scene .shade, .lp-hero-scene .grain { display: none !important; }
'''
open('cdn-vault/console-core.css', 'w', encoding='utf-8').write(c)
print('hero-animation.js' in s)
