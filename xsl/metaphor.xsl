<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">

<xsl:output method="html"/>

<xsl:template match="/">
<html>
<body>
    
<h2>Metaphor View</h2>

<xsl:for-each select="//metaphor">
    <div class="metaphor-item">
        <!-- wrap for styling -->
        <strong>
            <!-- bold, this is ugly though change it later. -->
            <xsl:value-of select="normalize-space(.)"/>
            <!-- Collapses space between the metaphors-->
        </strong>
    </div>
</xsl:for-each>

</body>
</html>

</xsl:template>

</xsl:stylesheet>
