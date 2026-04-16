<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">

<xsl:output method="html"/>
<!-- Makes it show up on the page as HTML-->

<xsl:template match="/">

<html>
<body>

<h2>Analysis View</h2>

<xsl:for-each select="//metaphor | //simile">
    <!-- Loop through all <metaphor> and <simile> elements
         anywhere in the XML document. -->

    <div class="analysis-item">
        <!-- For applying CSS highlights to the metaphors and similes. -->

        <xsl:value-of select="."/>
        <!-- makes the text show up from what is tagged with metaphor/simile -->

    </div>

</xsl:for-each>

</body>
</html>
</xsl:template>

</xsl:stylesheet>
<!-- End of the XSLT stylesheet -->
