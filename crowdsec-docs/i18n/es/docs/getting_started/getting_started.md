---
id: comenzando
title: Comenzando
---

¡Bienvenido a CrowdSec!

Esta sección te guiará a través de la instalación del Motor de Seguridad, y la implementación de tu primer Componente de Remediación.

:::info
Puede ver que a CrowdSec se le refiere como "Motor de Seguridad" y a los Bouncers como "Componentes de Remediación" dentro de la nueva documentación. Esto es para reflejar mejor el papel de cada componente dentro del ecosistema de CrowdSec.
:::

## Guía

Si deseas seguir un video paso a paso para instalar el Motor de Seguridad en un entorno sandbox, por favor sigue nuestra guía.

<iframe width="100%" height="500" src="https://www.youtube-nocookie.com/embed/yxbimVtd2nw?controls=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

o sigue los pasos a continuación.

## Instalación del Motor de Seguridad

### Prerrequisitos

El Motor de Seguridad, por defecto, usa los siguientes puertos:
  - 8080/tcp para la API
  - 6060/tcp para las métricas de Prometheus / Depuración

Si estos puertos no están disponibles en tu sistema, puedes cambiarlos en el archivo de configuración después de la instalación. Consulta [Configuración](/configuration/crowdsec_configuration.md) para obtener más información.

Ten en cuenta que la API es obligatoria para tu motor de seguridad, no la elimines de tu configuración.

#### Usando el repositorio

La forma más fácil de instalar el Motor de Seguridad es usar el repositorio oficial. Esto asegurará que siempre tengas la última versión del Motor de Seguridad.

Por favor, consulta la documentación relevante para tu sistema operativo:
- [Linux](/getting_started/install.mdx)
- [FreeBSD](/getting_started/install_freebsd.md)
- [Windows](/getting_started/getting_started_on_windows.md)

#### Instalación desde el código fuente

Si deseas instalar desde el código fuente, tenemos una breve guía en video sobre cómo hacerlo.

<iframe width="100%" height="500" src="https://www.youtube.com/embed/-1xxkwQyI2M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

#### Instalando un Componente de Remediación

Una vez que hayas instalado el Motor de Seguridad, puedes instalar un Componente de Remediación. Este es el componente que tomará medidas sobre las decisiones tomadas por el Motor de Seguridad.

Dependiendo de la configuración de tu red/sistema operativo, necesitarás instalar un Componente de Remediación diferente.

Si no estás seguro de cuál instalar, consulta nuestra sección de [Componentes de Remediación](/bouncers/intro.md) O únete a nuestro [discord](https://discord.gg/crowdsec) y pregunta a nuestra comunidad.

## Inscribiendo tu instancia

El siguiente paso es inscribir tu instancia en la consola de CrowdSec. Esto te permitirá ver tu instancia en la consola y mejorar tu seguridad utilizando nuestras listas de terceros.

Consulta la [sección de la consola](/console/intro.md) para obtener más información.
