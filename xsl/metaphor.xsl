<xsl:for-each select="//metaphor">

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
