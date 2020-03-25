interface ITemplate {
  brand: string;
  origin: string;
  logoSrc: string;
  forgotPasswordText: string;
  forgotPasswordDes: string;
  forgotPasswordBtnText: string;
  forgotPasswordBtnLink: string;
}

// tslint:disable-next-line: max-func-body-length
export const template = (data: ITemplate) => {
  const {
    brand,
    origin,
    logoSrc,
    forgotPasswordText,
    forgotPasswordDes,
    forgotPasswordBtnText,
    forgotPasswordBtnLink
  } = data;

  return `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center"  bgcolor="#efefef">
    <tr>
      <td align="center" valign="top"><table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
        <tr>
          <td align="center" valign="top" style="padding:0 25px;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td height="25" style="height:25px;" class="em_h20">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="${logoSrc}" width="42" height="42" alt="${brand}" border="0" style="display:block; font-family:Arial, sans-serif; font-size:18px; line-height:25px; text-align:center; color:#1d4685; font-weight:bold; max-width:208px;" class="em_w150" /></a></td>
            </tr>
            <tr>
              <td height="28" style="height:28px;" class="em_h20">&nbsp;</td>
            </tr>
          </table>
          </td>
        </tr>
      </table>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#efefef">
    <tr>
      <td align="center" valign="top" class="em_aside5"><table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
        <tr>
          <td align="center" valign="top" style="padding:0 25px; background-color:#ffffff;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td height="45" style="height:45px;" class="em_h20">&nbsp;</td>
            </tr>
            <tr>
              <td class="em_blue em_font_22" align="center" valign="top" style="font-family: Arial, sans-serif; font-size: 26px; line-height: 29px; color:#264780; font-weight:bold;">
                  ${forgotPasswordText}
              </td>
            </tr>
            <tr>
              <td height="14" style="height:14px; font-size:0px; line-height:0px;">&nbsp;</td>
            </tr>
            <tr>
              <td class="em_grey" align="center" valign="top" style="font-family: Arial, sans-serif; font-size: 16px; line-height: 26px; color:#434343;">
                  ${forgotPasswordDes}
              </td>
            </tr>
            <tr>
              <td height="26" style="height:26px;" class="em_h20">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" valign="top"><table width="250" style="width:250px; background-color:#b46bd6; border-radius:4px;" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td class="em_white" height="42" align="center" valign="middle" style="font-family: Arial, sans-serif; font-size: 16px; color:#ffffff; font-weight:bold; height:42px;">
                      <a href=${forgotPasswordBtnLink} target="_blank" style="text-decoration:none; color:#ffffff; line-height:42px; display:block;">
                          ${forgotPasswordBtnText}
                      </a>
                  </td>
                </tr>
              </table>
              </td>
            </tr>
            <tr>
              <td height="25" style="height:25px;" class="em_h20">&nbsp;</td>
            </tr>
            <tr>
              <td height="44" style="height:44px;" class="em_h20">&nbsp;</td>
            </tr>
          </table>
          </td>
        </tr>
      </table>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#efefef">
    <tr>
      <td align="center" valign="top"><table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
        <tr>
          <td align="center" valign="top" style="padding:0 25px;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td height="40" style="height:40px;" class="em_h20">&nbsp;</td>
            </tr>
            <tr>
              <td height="16" style="height:16px; font-size:1px; line-height:1px; height:16px;">&nbsp;</td>
            </tr>
            <tr>
              <td height="9" style="font-size:0px; line-height:0px; height:9px;" class="em_h10"><img src="/assets/pilot/images/templates/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;" /></td>
            </tr>
            <tr>
              <td align="center" valign="top"><table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td width="12" align="left" valign="middle" style="font-size:0px; line-height:0px; width:12px;"><a href="#" target="_blank" style="text-decoration:none;"><img src="/assets/pilot/images/templates/img_1.png" width="12" height="16" alt="" border="0" style="display:block; max-width:12px;" /></a></td>
                  <td width="7" style="width:7px; font-size:0px; line-height:0px;" class="em_w5">&nbsp;</td>
                  <td class="em_grey em_font_11" align="left" valign="middle" style="font-family: Arial, sans-serif; font-size: 13px; line-height: 15px; color:#434343;"><a href="${origin}" target="_blank" style="text-decoration:none; color:#434343;">${brand}</a> &bull; 68 Willow Road &bull; Menlo Park, CA 94025</td>
                </tr>
              </table>
              </td>
            </tr>
            <tr>
              <td height="35" style="height:35px;" class="em_h20">&nbsp;</td>
            </tr>
          </table>
          </td>
        </tr>
        <tr>
          <td height="1" bgcolor="#dadada" style="font-size:0px; line-height:0px; height:1px;"><img src="/assets/pilot/images/templates/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;" /></td>
        </tr>
        <tr>
          <td align="center" valign="top" style="padding:0 25px;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td height="16" style="font-size:0px; line-height:0px; height:16px;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" valign="top"><table border="0" cellspacing="0" cellpadding="0" align="left" class="em_wrapper">
                <tr>
                  <td class="em_grey" align="center" valign="middle" style="font-family: Arial, sans-serif; font-size: 11px; line-height: 16px; color:#434343;">&copy; ${brand} ${new Date().getFullYear()} </td>
                </tr>
              </table>
              </td>
            </tr>
            <tr>
              <td height="16" style="font-size:0px; line-height:0px; height:16px;">&nbsp;</td>
            </tr>
          </table>
          </td>
        </tr>
        <tr>
          <td class="em_hide" style="line-height:1px;min-width:650px;background-color:#efefef;"><img alt="" src="/assets/pilot/images/templates/spacer.gif" height="1" width="650" style="max-height:1px; min-height:1px; display:block; width:650px; min-width:650px;" border="0" /></td>
        </tr>
      </table>
      </td>
    </tr>
  </table>
  `;
};
