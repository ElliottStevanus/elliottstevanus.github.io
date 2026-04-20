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

<!-- JS CONNECTION -->
<script src="app.js"></script>

<style>

body {
    background: #f4f1ea;
    font-family: Georgia, serif;
    margin: 0;
    padding: 40px 0;
}

.reading-container {
    max-width: 720px;
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

/* FIGURATIVE LANGUAGE STYLES */

.metaphor {
    background: rgba(255, 200, 0, 0.35);
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
}

.simile {
    background: rgba(100, 160, 255, 0.35);
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
}

.aphorism {
    background: rgba(180, 255, 180, 0.35);
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
}

</style>

</head>

<body>

<div class="reading-container">

    <!-- SIMPLE PARAGRAPH OUTPUT -->
    <xsl:apply-templates select="//paragraph"/>

</div>

</body>
</html>

</xsl:template>

<!-- ========================= -->
<!-- PARAGRAPH TEMPLATE -->
<!-- ========================= -->

<xsl:template match="paragraph">

<p id="{generate-id()}">

    <xsl:apply-templates/>

</p>

</xsl:template>

<!-- ========================= -->
<!-- FIGURATIVE LANGUAGE -->
<!-- ========================= -->

<xsl:template match="metaphor | simile | aphorism">

<span class="{name()}"
      data-type="{name()}"
      data-sentence="{generate-id(..)}">

    <xsl:apply-templates/>

</span>

</xsl:template>

<!-- ========================= -->
<!-- TEXT NODE -->
<!-- ========================= -->

<xsl:template match="text()">
    <xsl:value-of select="."/>
</xsl:template>

</xsl:stylesheet>
