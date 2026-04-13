<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:template match="/">
    <div>
        <xsl:apply-templates/>
    </div>
</xsl:template>

<xsl:template match="paragraph">
    <p><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="simile">
    <i>
        <xsl:apply-templates/>
    </i>
</xsl:template>

<xsl:template match="metaphor">
    <b>
        <xsl:apply-templates/>
    </b>
</xsl:template>

</xsl:stylesheet>
