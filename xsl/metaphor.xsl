<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">


<xsl:for-each select="//metaphor">

    <div class="metaphor-item">

        <strong>
            <xsl:value-of select="."/>
        </strong>

        <br/>

        <em>
            <xsl:value-of select="ancestor::paragraph/text()"/>
        </em>

    </div>

</xsl:for-each>
</xsl:stylesheet>
