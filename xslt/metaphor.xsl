<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">

        <div class="metaphor-view">

            <h2>Metaphor-Only View</h2>

            <xsl:for-each select="//paragraph">

                <xsl:variable name="context" select="normalize-space(.)"/>

                <xsl:for-each select=".//metaphor">

                    <div class="metaphor-item">

                        <xsl:attribute name="data-context">
                            <xsl:value-of select="$context"/>
                        </xsl:attribute>

                        <xsl:attribute name="data-paragraph">
                            <xsl:value-of select="position()"/>
                        </xsl:attribute>

                        <xsl:value-of select="normalize-space(.)"/>

                    </div>

                </xsl:for-each>

            </xsl:for-each>

        </div>

    </xsl:template>

</xsl:stylesheet>
