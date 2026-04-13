<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html"/>

<xsl:template match="/">

<html>
<body>

<h2>Metaphor View</h2>

<xsl:for-each select="//paragraph/metaphor">

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

</body>
</html>

</xsl:template>

</xsl:stylesheet>
