Casos de prueba realizados:

Comclusiones:
1) Eliminar por ID

El problema que tuve con esto, que creo que es lo que me llevó mas tiempo de todo, fue elimar por id. Para obtener el ID por url estaba haciendo lo que vimos en clase que fue el:

const id = parseInt(pathname.slice(21));

Realmente no se porque exactamente me rompía ahí, pero entre todas las busquedas que hice la IA me recomendó usar lo siguiente:

const partes = pathname.split('/');
const id = parseInt(partes[partes.length - 1]);

Me dio esta opción ya que con esta forma, divide cada elemento de la url cada vez que hay un "/" y toma el ultimo, que en este caso va a ser el que contenga el id, sin importar cuantos elementos tenga la ruta.