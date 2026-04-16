<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">
<xsl:output method="html"/>

<xsl:template match="/">
<html>
<head>
    <style>
        body {
            background: #f4f1ea; 
            font-family: Georgia, serif; 
            margin: 0;
            padding: 40px 0;
        }

        .reading-container {
            max-width: 720px; /* gives it a book frame */
            margin: 0 auto; /* As above^ so bellow */
            padding: 40px 50px;
            background: white;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08); 
            line-height: 1.7; /* linespacing */
            font-size: 18px;
        }

        p {
            margin: 0 0 18px 0;
            text-indent: 1.5em; /* cheating to make it look nice. Change later. */
        }

        .metaphor {
            background: rgba(255, 200, 0, 0.35); /* highlighter colored highlight */
            padding: 2px 4px;
            border-radius: 4px;
        }

        .simile {
            background: rgba(100, 160, 255, 0.35); /* fun blue */
            padding: 2px 4px;
            border-radius: 4px;
        }
    </style>
</head>

<body>

<div class="reading-container">
<!-- for formatting -->

<xsl:for-each select="//paragraph[position() mod 5 = 1]">
    <!-- this is some jury rig nonsense truthfully, but oh well.... Select every 5th paragraoh element
    (you were lazy with your xml so this is necessary to make it look nice. else every sentence would be a paragraph)
         The code below actually groups them togeteher to create a new bigger paragraph... -->

    <p>

        <xsl:apply-templates select="node()"/>
        <!-- Process the current paragraph’s content -->

        <xsl:text> </xsl:text>
        <!-- Adds a space between paragraphs -->

        <xsl:if test="following-sibling::paragraph[1]">
            <!-- If the next paragraph exists -->
            <xsl:apply-templates select="following-sibling::paragraph[1]/node()"/>
            <!-- Add its content -->

            <xsl:text> </xsl:text>
            <!--without this there is no space between the end of a sentence and the next one-->
        </xsl:if>

        <xsl:if test="following-sibling::paragraph[2]">
            <!-- Same as above, you get the idea-->
            <xsl:apply-templates select="following-sibling::paragraph[2]/node()"/>
            <xsl:text> </xsl:text>
        </xsl:if>

        <xsl:if test="following-sibling::paragraph[3]">
            <xsl:apply-templates select="following-sibling::paragraph[3]/node()"/>
            <xsl:text> </xsl:text>
        </xsl:if>

        <xsl:if test="following-sibling::paragraph[4]">
            <xsl:apply-templates select="following-sibling::paragraph[4]/node()"/>
        </xsl:if>

    </p>
</xsl:for-each>

</div>

</body>
</html>
</xsl:template>

<!--  metaphor highlights -->
<xsl:template match="metaphor">
    <span class="metaphor">
        <xsl:apply-templates/>
    </span>
</xsl:template>

<!-- simile highlights -->
<xsl:template match="simile">
    <span class="simile">
        <xsl:apply-templates/>
    </span>
</xsl:template>

<!-- DEFAULT TEXT -->
<xsl:template match="text()">
    <xsl:value-of select="."/>
    <!-- Output the text exactly as it appears -->
</xsl:template>

</xsl:stylesheet>
