<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">

<xsl:output method="html"/>

<xsl:template match="/">
<html>
<body>

<h2>Analysis View</h2>

<xsl:for-each select="//metaphor | //simile">

    <div class="analysis-item">
        <xsl:value-of select="."/>
    </div>

</xsl:for-each>

</body>
</html>
</xsl:template>

</xsl:stylesheet>
