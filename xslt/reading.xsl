<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html"/>

<xsl:template match="/">
<html>
<body>

<xsl:for-each select="//paragraph">
    <p>
        <xsl:apply-templates/>
    </p>
</xsl:for-each>

</body>
</html>
</xsl:template>

</xsl:stylesheet>
