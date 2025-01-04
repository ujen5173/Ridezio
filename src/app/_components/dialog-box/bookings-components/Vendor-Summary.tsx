const VendorSummary = () => {
  return (
    <div>
      Vendor Summary
      {/* <div className="flex w-full flex-wrap items-center justify-center gap-4">
        {paymentDetails.merchantCode && (
          <>
            <button
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium text-slate-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                "h-12 gap-2 px-6 py-3",
                "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                "rounded-md",
              )}
              type="button"
              onClick={() => {
                void continuePaymentOffline("online-payment");
              }}
            >
              {continueWithOnlineLoading ? (
                <>
                  <Loader
                    size={15}
                    className="ml-2 animate-spin text-slate-600"
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Image
                    src="/esewa.svg"
                    width={23}
                    height={23}
                    alt="EWallet"
                  />
                  <span>Continue with Online payment</span>
                </>
              )}
            </button>

            <Separator orientation="vertical" className="h-10" />
          </>
        )}
        <Button
          variant={"outline"}
          onClick={async () => {
            void continuePaymentOffline("cash");
          }}
          className="gap-2 font-medium text-slate-700"
        >
          {continueWithCashLoading ? (
            <>
              <Loader size={15} className="ml-2 animate-spin text-slate-600" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Image src="/cash.svg" width={23} height={23} alt="Cash" />
              <span>Continue with Cash</span>
            </>
          )}
        </Button>
      </div> */}
    </div>
  );
};

export default VendorSummary;
