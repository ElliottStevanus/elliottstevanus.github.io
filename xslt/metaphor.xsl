<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html"/>

<xsl:template match="/">
<html>
<body>

<h2>Metaphor View</h2>

<xsl:for-each select="//metaphor">
    <div class="metaphor-item">
        <xsl:value-of select="."/>
    </div>
</xsl:for-each>

</body>
</html>
</xsl:template>

</xsl:stylesheet>
