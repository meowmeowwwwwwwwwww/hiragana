"""Сборка: hiragana.html (тетрадь в Claude) и сайт в корне репозитория (приложение для телефона).
Запуск: python3 src/build.py   — VERSION в sw.js меняется сам при каждой сборке (дата и время, UTC).
Пишет в корень: index.html, sw.js, manifest.webmanifest, иконки из icons/ и licenses.txt."""
import base64, json, os, shutil, time
os.chdir(os.path.dirname(os.path.abspath(__file__)))
OUT = '..'  # корень репозитория — оттуда GitHub Pages раздаёт сайт
rd = lambda f: open(f, encoding='utf-8').read()
t = rd('app_template.html')
parts = {'__KANA__': rd('kana2.json'), '__RECOG__': rd('recognizer.js'), '__STAB__': rd('stabilizer.js'),
         '__PUPPY__': rd('puppy.js'), '__PICS__': rd('pics.js')}
def fill(tpl, pwa):
    out = tpl.replace('__IS_PWA__', 'true' if pwa else 'false', 1)
    for k, v in parts.items(): out = out.replace(k, v, 1)
    return out

# 1) тетрадь в Claude
art = fill(t, False)
open('hiragana.html', 'w', encoding='utf-8').write(art)

# 2) приложение
def face(family, weight, file):
    b64 = base64.b64encode(open(file, 'rb').read()).decode()
    return f'@font-face{{font-family:"{family}";font-weight:{weight};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,{b64}) format("woff2");}}'
fonts = '<style>' + face('Klee One', 600, 'fonts/klee-600.woff2') + ''.join(face('M PLUS Rounded 1c', w, f'fonts/mplus-{w}.woff2') for w in (400, 700, 800)) + '</style>'
a = t.index('<!--FONTS-->'); b = t.index('<!--/FONTS-->') + len('<!--/FONTS-->')
pt = t[:a] + fonts + t[b:]
app = fill(pt, True)
split = app.index('<div class="wrap" id="app">')
head_extra = ('<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  '<meta name="theme-color" content="#FFD9E6">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="Хирагана">\n'
  '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<link rel="icon" type="image/png" href="icon-192.png">\n')
html = '<!doctype html>\n<html lang="ru">\n<head>\n' + head_extra + app[:split] + '\n</head>\n<body>\n' + app[split:] + '\n</body>\n</html>\n'
open(f'{OUT}/index.html', 'w', encoding='utf-8').write(html)

manifest = {"name": "Тетрадь хираганы", "short_name": "Хирагана", "start_url": "./", "scope": "./", "display": "standalone",
  "orientation": "portrait", "background_color": "#FFEDF3", "theme_color": "#FFD9E6", "lang": "ru",
  "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
open(f'{OUT}/manifest.webmanifest', 'w', encoding='utf-8').write(json.dumps(manifest, ensure_ascii=False, indent=2))

version = time.strftime('%Y%m%d-%H%M%S', time.gmtime())
sw = rd('sw_template.js').replace('__VERSION__', version)
open(f'{OUT}/sw.js', 'w', encoding='utf-8').write(sw)
for f in sorted(os.listdir('icons')): shutil.copyfile(f'icons/{f}', f'{OUT}/{f}')
shutil.copyfile('licenses.txt', f'{OUT}/licenses.txt')
print('hiragana.html', len(art.encode()), '| index.html', len(html.encode()), '| версия', version)
