# MicroFreak Reader

_(en français [plus bas](#Lecteur-de-preset-MicroFreak))_

This application allows you to **read and display the presets stored in the MicroFreak memory**.

You can only read _saved_ presets. The application can not read the current, unsaved, values of the controllers.

This application can only _read_ presets. You can not edit presets. You can not send values to the MicroFreak.

However, the application can send a PC (Program Change) message to the MicroFreak when you select a preset in the application.

Once the application has read a preset, it is kept in memory until you close your browser or refresh the page.

This application does not read nor display the stored sequences.

[![light theme](/screenshots/light-theme-320x196.png)](https://raw.githubusercontent.com/francoisgeorgy/microfreak-reader/master/screenshots/light-theme.png) ![dark theme](/screenshots/dark-theme-320x196.png)

_light and dark themes_

## Accuracy of the displayed data 

:warning: To create this application I reverse-engineered some of the sysex messages exchanged between the MicroFreak and the
Arturia MIDI Control Center. This process is subject to errors and misinterpretations. Therefore **NO GUARANTEE, EXPRESS OR IMPLIED, IS GIVEN AS TO THE ACCURACY OF THE DISPLAYED DATA**. 

If you think the application display wrong values, send me the preset
and any useful info to reproduce the problem and I will fix the application if necessary. 
If possible, use the https://github.com/francoisgeorgy/microfreak-reader/issues page to send any feedback.

## Requirements

- An Arturia MicroFreak synthesizer.
- A browser supporting the WebMIDI API (Chrome, Opera).

## Usage

1. Connect the MicroFreak to your PC via its USB or MIDI ports.
2. If it's not already done, open the Application in your browser.
3. In the application, select the MIDI input and output ports corresponding to your MicroFreak.
4. In the application, enter the preset number you want to read.
5. Click the `READ` button.

The buttons `READ 1..256`, et al. allows you to read all the MicroFreak presets at once. It can take some time. Be patient.
Click the STOP button to abort the read process.  

### File save

You can save the application's currently loaded data in a file. This allow you to read the MicroFreak once and, later on, to
reload this file and view the presets without having to read the MicroFreak again.

The application already provides the pre-loaded data for the factory presets and other free presets packs offered
by Arturia.

The file saved by the application is **not** a sysex file nor a MicroFreak preset file. You can not use it with the 
MIDI Control Center.

## Problems, bug

If the Application does not display anything after having red a preset, that's probably because the MIDI communication is 
not working correctly between your browser and the MicroFreak. Restart your MicroFreak. If the problem persist, restart
the MicroFreak and reload the Application in your browser.

For any other problem or suggestion, feel free to open an issue at https://github.com/francoisgeorgy/microfreak-reader/issues

## Trademarks

Arturia, MicroFreak and all other products, logos or company names quoted in this document and in the application are
trademarks or registered trademarks of their respective owners.


----

# Lecteur de preset MicroFreak

Cette application vous permet de **lire et afficher les _presets_ sauvegardés dans votre MicroFreak**.

Vous ne pouvez lire que des presets _sauvegardés_. L'application ne peut pas lire les valeurs courantes, non sauvegardées,
des contrôleurs.

L'application ne fait que de la _lecture_. Vous ne pouvez pas éditer les presets. Vous ne pouvez pas envoyer de valeurs au
MicroFreak.

Cependant, l'application est capable d'envoyer un message PC (Program Change) au MicroFreak lorsque vous sélectionnez un
preset dans l'application.

Une fois que l'application a lu un preset, celui-ci est conservé en mémoire jusqu'à ce que vous fermiez votre navigateur ou que vous rafraîchissiez la page.

## Précision des données affichées

:warning: Pour créer cette application, j’ai analysé certains des messages sysex échangés entre le MicroFreak et le
MIDI Control Center de Arturia. Ce processus est sujet à des erreurs et à des interprétations erronées. Par conséquent 
**AUCUNE GARANTIE, EXPRESSE OU IMPLICITE, N'EST DONNEE QUANT A L'EXACTITUDE DES DONNEES AFFICHEES**.

Si vous pensez que l'application affiche des valeurs incorrectes, envoyez-moi le _preset_ et toute information utile pour 
reproduire le problème et je corrigerai l'application si nécessaire. Si possible, utilisez la page 
https://github.com/francoisgeorgy/microfreak-reader/issues pour cela.

## Prérequis

- Un synthétiseur Arturia MicroFreak.
- Un navigateur web supportant le standard WebMIDI (Chrome, Opera).

## Utilisation

1. Connectez le MicroFreak à votre PC via son port USB ou ses ports MIDI.
2. Si ce n'est pas déjà fait, ouvrez l'application dans votre navigateur.
3. Dans l'application, sélectionnez l'entrée et la sortie MIDI correspondant à votre MicroFreak.
4. Dans l'application, entrez le no du preset que vous souhaitez lire.
5. Cliquez sur le bouton `READ`. 

Les boutons `READ 1..256`, ... vous permettent de lire tous les presets du MicroFreak en une fois.
Cela peut prendre du temps. Soyez patient. Cliquez sur le bouton `STOP` pour arrêter le processus de lecture.

### Sauvegarde de fichier

Vous pouvez enregistrer les données actuellement chargées de l'application dans un fichier. Cela vous permet de lire 
une seule fois le MicroFreak et, plus tard, de recharger ce fichier et d'afficher les presets sans avoir à relire 
le MicroFreak.

L'application fournit déjà les données préchargées pour les presets d'usine et autres packs de presets gratuits 
proposés par Arturia.

Le fichier enregistré par l'application n'est ni un fichier sysex ni un fichier de preset au format MicroFreak. 
Vous ne pouvez pas l'utiliser avec le MIDI Control Center.

## Problèmes, bugs

Si l'application n'affiche rien après avoir lu un preset, c'est probablement parce que la communication MIDI ne fonctionne
pas correctement entre votre navigateur et le MicroFreak. Redémarrez votre MicroFreak. Si le problème persiste, Redémarrez 
le MicroFreak et rechargez l'application dans votre navigateur. 

Pour tout autre problème ou suggestion, n'hésitez pas à ouvrir un ticket 
à l'adresse https://github.com/francoisgeorgy/microfreak-reader/issues

## Marques

Arturia, MicroFreak et tous les autres produits, logos ou noms de sociétés cités dans ce documents et dans l'application 
sont des marques ou des marques déposées appartenant à leurs propriétaires respectifs.



