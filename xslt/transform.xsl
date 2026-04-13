<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- ROOT -->
    <xsl:template match="/">
        <div>
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="paragraph">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>

    <xsl:template match="simile">
        <i class="simile">
            <xsl:apply-templates/>
        </i>
    </xsl:template>

    <xsl:template match="metaphor">
        <span class="metaphor">
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <xsl:template match="text()">
        <xsl:value-of select="."/>
    </xsl:template>

</xsl:stylesheet>
