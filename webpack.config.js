const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const cssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // npm i css-minimizer-webpack-plugin -D
const terserPlugin = require('terser-webpack-plugin'); // ya viene por defecto  npm i terser-webpack-plugin -D
const Dotenv = require('dotenv-webpack'); // npm i dotenv-webpack -D variables de entorno
// const { cleanWebpackPlugin } = require('clean-webpack-plugin'); //npm i clean-webpack-plugin -D



module.exports = {
    mode: 'production', // le pasamos explicitamente el modo desde el archivo
    // entry: './src/index.js' // Entry nos permite decir el punto de entrada de nuestra aplicación
    output:{ // Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
        path: path.resolve(__dirname, 'dist'), //Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
        filename: "[name].[contenthash].js",  // filename le pone el nombre al archivo final   
        assetModuleFilename: "assets/images/[contenthash][ext][query]", // para las imagenes procesadas hast=nombre ext= extencion
        clean: true,
    },
    resolve: {
        // Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea
        extensions: [".js"],
        alias: {
            '@utils':path.resolve(__dirname, 'src/utils/'),
            '@templates':path.resolve(__dirname, 'src/templates/'),
            '@styles':path.resolve(__dirname, 'src/styles/'),
            '@assets':path.resolve(__dirname, 'src/assets/images/'),
            // el alias de cada carpeta para los import
        }
    },
    //comando de instalar babel npm install babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D 
    module: {
        rules: [
            {
                test: /\.m?js$/, // propiedad que identifica cuáles archivos deberán ser transformados
                exclude: /node_modules/,
                use:{ //propiedad que identifica el loader que será usado para transformar a dichos archivos
                    loader:"babel-loader"
                }
            },
            {
               test: /\.css|.styl$/i, 
                use:[MiniCssExtractPlugin.loader,
                'css-loader',
                'stylus-loader'
                ] ,
            },
            {
                test: /\.png/,
                type: 'asset/resource', //Al usar asset/resource estamos accediendo al Asset module de webpack que incluye file-loader (el que estamos usando ahora) 
            },
            {
                test: /\.(woff|woff2)$/i,  //esta linea va para las dos formas
                type: 'asset/resource',
                generator:{
                    filename: 'assets/fonts/[contenthash][ext]',
                },

                // viaja forma 
                // use:{
                //     loader: 'url-loader',
                //     options: {
                //         limit: 10000, // Habilita o deshabilita la transformación de archivos en base64.
                //         mimetype: "application/font-woff", // Especifica el tipo MIME con el que se alineará el archivo. 
                //         name: "[name].[ext]", // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria  ubuntu-regularhola.woff
                //         outputPath: "./assets/fonts/", 
                //         publicPath: "./assets/fonts/",
                //         esModule: false,
                //     },
                // }
                
            }
            
        ]
    },
    // devServer:{
    //     open: true, // abrir el navegador 
    //     port:  300e0, //en el puerto #?
    //     overlay: true, // activar overlay de errores en el navegador
    //     compress: true,
    // },
    plugins:[
        new HtmlWebpackPlugin({  //CONFIGURACIÓN DEL PLUGIN
            //inject: true,  INYECTA EL BUNDLE AL TEMPLATE HTML que es el enlace al script
            // entry: 'index.js', el archivo que agregara al script
            inject: 'body',
            template: './public/index.html', // LA RUTA AL TEMPLATE HTML
            filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({ //npm i copy-webpack-plugin -D ya no  es necesario si implementamos el loader de la linea 34 pero se deben importar imagenes en el js
            patterns:[
                {
                    from:path.resolve(__dirname, "src", "assets/images"), // CARPETA A MOVER AL DIST
                    to: "assets/images" // RUTA FINAL DEL DIST
                }
            ]
        }),
        new Dotenv(),
        // new cleanWebpackPlugin(),
    ],
    optimization:{
        // nodeEnv: 'production', Le dice a webpack que establezca process.env.NODE_ENV
        minimize: true, //por defecto
        minimizer:[ //permite anular el minimizador predeterminado al proporcionar una o más instancias de TerserPlugin personalizadas 
            new cssMinimizerPlugin({
                minimizerOptions: {
                    preset:[
                        "default",
                        {
                            discardComments: { removeAll: true},
                        },
                    ],
                },
            }),
            new terserPlugin(), // forma actigua ya no es necesaria esta linea 
        ]
    }
}

// git remote add origin https://github.com/NOMBRE_USUARIO/NOMBRE_PROYECTO.git

// git push -u origin master
// añgo de git

// $ git remote -v
// # Visualiza los remotos existentes
// > origin  https://github.com/ghost/reactivecocoa.git (fetch)
// > origin  https://github.com/ghost/reactivecocoa.git (push)

// $ git remote set-url origin https://github.com/ghost/ReactiveCocoa.git
// # Cambia la URL del remoto 'origen'