<?xml version="1.0" encoding="UTF-8"?>

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

        <strong>
            <xsl:value-of select="."/>
        </strong>

        <br/>

        <em>
            <xsl:value-of select="ancestor::paragraph"/>
        </em>

    </div>

</xsl:for-each>

</body>
</html>

</xsl:template>

</xsl:stylesheet>
