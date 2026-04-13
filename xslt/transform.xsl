<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- OUTPUT HTML -->
    <xsl:output method="html" indent="yes"/>

    <!-- ROOT TEMPLATE -->
    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8"/>
                <title>The Picture of Dorian Gray</title>

                <!-- LINK CSS -->
                <link rel="stylesheet" href="../css/style.css"/>

                <!-- LINK JAVASCRIPT -->
                <script src="../js/script.js" defer="defer"></script>
            </head>

            <body>

                <h1>The Picture of Dorian Gray</h1>

                <!-- SEARCH PANEL -->
                <div id="analysis-panel">
                    <input type="text" id="figure-search"
                        placeholder="Search figurative language..."/>
                    <ul id="search-results"></ul>
                </div>

                <!-- TEXT CONTAINER (IMPORTANT FOR JS) -->
                <div id="novel-text">
                    <xsl:apply-templates/>
                </div>

            </body>
        </html>
    </xsl:template>

    <!-- PARAGRAPHS -->
    <xsl:template match="paragraph">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>

    <!-- DEFAULT TEXT HANDLING -->
    <xsl:template match="text()">
        <xsl:value-of select="."/>
    </xsl:template>

</xsl:stylesheet>
