<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- OUTPUT AS HTML -->
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <!-- ROOT TEMPLATE -->
    <xsl:template match="/">

        <html>
            <head>
                <title>Metaphor Only View</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }

                    .metaphor-item {
                        display: block;
                        margin: 10px 0;
                        padding: 8px;
                        border-left: 3px solid #444;
                        cursor: pointer;
                    }

                    .metaphor-item:hover {
                        background: #f2f2f2;
                    }
                </style>
            </head>

            <body>

                <h2>Metaphor-Only View</h2>

                <!-- LOOP THROUGH ALL PARAGRAPHS -->
                <xsl:for-each select="//paragraph">

                    <!-- STORE FULL CONTEXT -->
                    <xsl:variable name="context" select="normalize-space(.)"/>

                    <!-- FIND METAPHORS INSIDE -->
                    <xsl:for-each select=".//metaphor">

                        <div class="metaphor-item">
                            
                            <!-- METAPHOR TEXT -->
                            <xsl:value-of select="normalize-space(.)"/>

                            <!-- STORE CONTEXT FOR JS POPUP -->
                            <span style="display:none;">
                                <xsl:attribute name="data-context">
                                    <xsl:value-of select="$context"/>
                                </xsl:attribute>
                            </span>

                        </div>

                    </xsl:for-each>

                </xsl:for-each>

            </body>
        </html>

    </xsl:template>

</xsl:stylesheet>
