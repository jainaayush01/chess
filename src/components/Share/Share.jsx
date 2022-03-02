import React, { useState } from "react";
import styles from "./Share.module.scss";
import {
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
} from "react-share";
import { Dialog } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

const iconSize = "48";
const iconRound = true;
const Share = ({ link }) => {
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState("copy");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.shareBtn} onClick={handleClickOpen}>
        Share
      </div>
      <Dialog open={open} onClose={handleClose}>
        <div className={styles.modal}>
          <div className={styles.content}>
            <p className={styles.primaryText}>Share this link via</p>
            <div className={styles.icons}>
              <span>
                <LinkedinShareButton url={link}>
                  <LinkedinIcon size={iconSize} round={iconRound} />
                </LinkedinShareButton>
              </span>
              <span>
                <TwitterShareButton url={link}>
                  <TwitterIcon size={iconSize} round={iconRound} />
                </TwitterShareButton>
              </span>
              <span>
                <TelegramShareButton url={link}>
                  <TelegramIcon size={iconSize} round={iconRound} />
                </TelegramShareButton>
              </span>
              <span>
                <WhatsappShareButton url={link}>
                  <WhatsappIcon size={iconSize} round={iconRound} />
                </WhatsappShareButton>
              </span>
              <span>
                <FacebookShareButton url={link}>
                  <FacebookIcon size={iconSize} round={iconRound} />
                </FacebookShareButton>
              </span>
            </div>
            <p className={styles.secondaryText}>Or copy link</p>
            <div className={styles.copyField}>
              🔗
              <input
                className={styles.copyInput}
                type="text"
                readOnly
                defaultValue={link}
              />
              <CopyToClipboard
                text={link}
                className={styles.copyBtn}
                onCopy={() => {
                  setCopy("copied");
                }}
              >
                <span>{copy}</span>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Share;
