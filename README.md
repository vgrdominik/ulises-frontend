# Ulises Frontend

Frontend para Ulises.

## Sobre mi

https://valentigamez.com

## Instalación

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

En producción añadir .htaccess en la carpeta dist:

```
<IfModule mod_rewrite.c>
  RewriteEngine On

    # ssl
    RewriteCond %{SERVER_PORT} 80
    RewriteRule ^(.*)$ https://ulises-api.miolimpo.org/$1 [R,L]

    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
``` 

## Aprendiendo sobre Ulises

Por hacer.

## Patrocinadores de Valentí Gàmez

<p align="center"><img src="https://www.ciclotic.com/images/logo.png?1" width="200"></p>

## Contribución

No se contempla la contribución de forma comunitaria en este repositorio. Aún así puedes disponer del código y comentar en iam@valentigamez.com. Lo que consideres serà muy agradecido.

## Vulnerabilidades de seguridad

Si descubres algún fallo de seguridad lo puedes enviar a iam@valintigamez.com con el asunto "Vulnerabilidad metricasPedidosFrontend". Valentí Gàmez, el líder del proyecto se compromete a responder y tratar cualquier situación constructiva.

## LICENCIA

Por hacer. 
