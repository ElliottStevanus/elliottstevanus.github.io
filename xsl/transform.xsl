<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html"/>

<!-- ========================= -->
<!-- ROOT TEMPLATE -->
<!-- ========================= -->

<xsl:template match="/">

<html>
<head>

<title>Dorian Gray Text</title>

<link rel="stylesheet" href="css/style.css"/>

<!-- JS APP LAYER -->
<script src="js/app.js"></script>

<style>

body {
    background: #f4f1ea;
    font-family: Georgia, serif;
    margin: 0;
    padding: 0;
}

/* NAV */
nav {
    display: flex;
    gap: 15px;
    padding: 15px 25px;
    background: #222;
}

nav a {
    color: white;
    text-decoration: none;
}

/* LAYOUT */
#app {
    padding: 20px;
}

/* CONTROLS */
#controls {
    margin: 20px 0;
}

button {
    margin-right: 10px;
    padding: 8px 12px;
}

/* READING VIEW */
.reading-container {
    max-width: 750px;
    margin: 0 auto;
    background: white;
    padding: 40px 50px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    line-height: 1.7;
    font-size: 18px;
}

p {
    margin: 0 0 18px 0;
    text-indent: 1.5em;
}

/* FIGURATIVE LANGUAGE */
metaphor {
    background: rgba(255, 200, 0, 0.35);
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
}

simile {
    background: rgba(100, 160, 255, 0.35);
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
}

aphorism {
    background: rgba(180, 255, 180, 0.35);
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
}

/* VIEW PANELS */
.view {
    display: none;
}

.view.active {
    display: block;
}

</style>

</head>

<body>

<nav>
    <a href="#">Home</a>
    <a href="#">Text</a>
    <a href="#">Project</a>
</nav>

<div id="app">

    <div id="controls">
        <button id="view-reading">Reading</button>
        <button id="view-metaphor">Metaphor View</button>
        <button id="view-analysis">Analysis</button>
    </div>

    <!-- ========================= -->
    <!-- READING VIEW -->
    <!-- ========================= -->

    <div id="reading-view" class="view active">

        <div class="reading-container">

            <xsl:apply-templates select="//paragraph"/>

        </div>

    </div>

    <!-- ANALYSIS VIEW -->
    <div id="analysis-view" class="view">
        <h2>Analysis View</h2>

        <div id="analysis-sentence"></div>
        <div id="word-panel"></div>
        <div id="graph-container"></div>
    </div>

    <!-- METAPHOR VIEW -->
    <div id="metaphor-view" class="view">
        <h2>Metaphor Connections</h2>
        <div id="metaphor-results"></div>
    </div>

</div>

</body>
</html>

</xsl:template>

<!-- ========================= -->
<!-- PARAGRAPHS (FIXED ID SYSTEM) -->
<!-- ========================= -->

<xsl:template match="paragraph">

<p id="p-{count(preceding::paragraph) + 1}">

    <xsl:apply-templates/>

</p>

</xsl:template>

<!-- ========================= -->
<!-- FIGURATIVE LANGUAGE (FIXED LINKS) -->
<!-- ========================= -->

<xsl:template match="metaphor | simile | aphorism">

  <xsl:element name="{name()}">

    <xsl:attribute name="data-type">
      <xsl:value-of select="name()"/>
    </xsl:attribute>

    <xsl:attribute name="data-sentence">
      <xsl:value-of select="concat('p-', count(ancestor::paragraph/preceding::paragraph) + 1)"/>
    </xsl:attribute>

    <xsl:apply-templates/>

  </xsl:element>

</xsl:template>

<!-- ========================= -->
<!-- TEXT -->
<!-- ========================= -->

<xsl:template match="text()">
    <xsl:value-of select="."/>
</xsl:template>

</xsl:stylesheet>
