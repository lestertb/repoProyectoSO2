### ¿Para qué es este repositorio? ###

Este repositorio es un ejemplo simple de la implementación de Azure Cognitives Services con multiprocesamiento para el reconocimiento de esceneas, géneros, emociones y demás, en imagenes. Este proyecto fue realizado mediante el lenguaje javascript con una interacción con python para la realización del multiproceso.

### ¿Cómo puedo instalarlo? ###

Para empezar, es necesario tener una versión  `Python` entre `3.7` a `3.9` y `Nodejs` se recomienda entre `v14.18.0` a `v16.13.0`, también se necesita clonar el presente directorio con el siguiente comando:

```console
    git clone https://lestertb@bitbucket.org/lestertb/repoproyectoso2.git
```

Una vez descargado el proyecto es necesario descargar las dependencias, para hacerlo
es necesario estar posicionado sobre la carpeta del proyecto con una consola de línea
de comandos como `Git Bash`, `CMD` o `Powershell`, y ejecutar:

```console
    npm run startup
```

### ¿Cómo puedo ejecutarlo? ###

Para empezar a usar el proyecto es necesario tener algunas imagenes para analizar. Coloque cualquier imagen en la carpeta `images` y por medio de una consola de línea de comandos ejecute:

```console
    npm start
```

Este comando ejecutará el servidor de nodejs donde accediendo a la dirección `http://localhost:8081` podrá observar la página HTML que le permitirá utilizar las funcionalidades del proyecto para la utilización de los servicios de Azure.

Se verá de esta forma:

![Screenshot](./public/assets/imgReadme/Capture.PNG)

Con el botón `Normal`, se ejecutará la funcionalidad sin multiproceso, es decir sin la utilización de Python.

Con el botón `Multiprocesamiento` se ejecutará la funcionalidad con multipocesamiento utilizando Python.

### Resultados ###

En la consola se imprimirá el resultado del análisis en formato JSON, y a la vez, en el página corriendo en la dirección `http://localhost:8081` se observará unos gráficos del resultado.

Gráficos - Info:

![Screenshot](./public/assets/imgReadme/Capture2.PNG)